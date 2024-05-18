const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
const io = require('../websocket.js'); // Import the io object from websocket.js

server.listen(1883, function () {
  console.log('server started and listening on port 1883');
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