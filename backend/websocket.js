const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server, {
  pingInterval: 10000, // 10 seconds
  pingTimeout: 5000,   // 5 seconds
  cookie: false
});

io.on('connection', (socket) => {
  socket.on('sensorData', (data) => {
    console.log(`Received sensor data => ${data}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${reason}`);
  });
});

server.listen(8081, () => {
  console.log('Socket.IO server listening on port 8081');
});

module.exports = io;
