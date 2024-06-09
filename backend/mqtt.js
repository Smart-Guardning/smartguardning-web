const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const io = require('./websocket.js');
const ESP32Controller = require('./controllers/ESP32Controller');

server.listen(1884, function () {
  console.log('MQTT server started and listening on port 1884');
});

aedes.on('client', function (client) {
  console.log('client connected', client.id);
});

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('message from client', client.id);
  }
  const message = packet.payload.toString();
  console.log('Published', message);

  io.emit('sensorData', message);

  try {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.node_id) {
      ESP32Controller.addSensorData(parsedMessage);

      io.emit('newNode', parsedMessage.node_id);
    } else {
      console.error('Invalid sensor data format');
    }
  } catch (error) {
    console.error('Error parsing MQTT message:', error);
    handleControlMessage(packet.topic, message);
  }
});

function handleControlMessage(topic, message) {
  if (message === 'WATER_ON' || message === 'WATER_OFF') {
    console.log(`Received control message: ${message}`);
    io.emit('controlMessage', { topic, message });
  } else {
    console.error('Unknown message format');
  }
}
