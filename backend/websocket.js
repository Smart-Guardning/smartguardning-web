const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on('sensorData', (data) => {
    console.log(`Received sensor data => ${data}`);
  });
});

server.listen(8081, () => {
  console.log('Socket.IO server listening on port 8081');
});

module.exports = io;
