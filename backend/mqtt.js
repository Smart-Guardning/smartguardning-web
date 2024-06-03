const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const io = require('./websocket.js'); // Import the io object from websocket.js
// mqtt.js
const mqtt = require('mqtt');
const client  = mqtt.connect('mqtt://localhost:1884') // Update with your broker address

client.on('connect', function () {
  console.log('mqtt client connected');
});

module.exports = client;
server.listen(1884, function () {
  console.log('server started and listening on port 1884');
});

aedes.on('client', function (client) {
  console.log('client connected', client.id);
});

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('message from client', client.id);
  }
  console.log('Published', packet.payload.toString());

  // Emit the sensor data to all connected WebSocket clients
  io.emit('sensorData', packet.payload.toString());
});