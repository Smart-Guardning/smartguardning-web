const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const io = require('./websocket');
const mqttClient = require('mqtt').connect('mqtt://localhost:1884');

mqttClient.on('connect', () => {
  console.log('MQTT client connected');
});

mqttClient.subscribe('smartfarm/sensor/#', (err) => {
  if (err) {
    console.error('Error subscribing to topic:', err);
  } else {
    console.log('Subscribed to topic: smartfarm/sensor/#');
  }
});

mqttClient.on('message', (topic, message) => {
  if (topic.startsWith('smartfarm/sensor/')) {
    const sensorData = JSON.parse(message.toString());
    const nodeId = sensorData.node_id;
    // Emit the sensor data to all connected WebSocket clients
    io.emit('sensorData', sensorData);
  }
});

server.listen(1884, () => {
  console.log('MQTT server started and listening on port 1884');
});

aedes.on('client', (client) => {
  console.log('Client connected', client.id);
});

aedes.on('publish', (packet, client) => {
  console.log('Published', packet.payload.toString());
});

module.exports = mqttClient;
