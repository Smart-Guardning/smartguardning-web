const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080", // 클라이언트의 주소
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
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
