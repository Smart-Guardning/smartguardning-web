const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: '*', // 모두 허용
  }
});

io.on('connection', (socket) => {
  socket.on('sensorData', (data) => {
    // Handle the sensor data here
    console.log(`Received sensor data => ${data}`);
  });
});

server.listen(8081, () => {
  console.log('Socket.IO server listening on port 8081');
});

module.exports = io;
