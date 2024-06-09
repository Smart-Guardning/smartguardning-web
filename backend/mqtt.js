const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const io = require('./websocket.js'); // Import the io object from websocket.js
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
  console.log('Published', packet.payload.toString());

  // Emit the sensor data to all connected WebSocket clients for debugging
  io.emit('sensorData', packet.payload.toString());

  // Parse the MQTT message and save to database
  try {
    const sensorData = JSON.parse(packet.payload.toString());
    ESP32Controller.addSensorData(sensorData); // Add sensor data to DB

    // Emit the node ID to all connected WebSocket clients
    io.emit('newNode', sensorData.node_id);
  } catch (error) {
    console.error('Error parsing MQTT message:', error);
  }
});
