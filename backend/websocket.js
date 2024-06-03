const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on('sensorData', (data) => {
    // Handle the sensor data here
    console.log(`Received sensor data => ${data}`);
  });
});

server.listen(8081, () => { // 변경된 포트
  console.log('Socket.IO server listening on port 8081'); // 변경된 포트
});

module.exports = io; // Export the io object so it can be used in other files