const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
  pingInterval: 10000, // 10 seconds
  pingTimeout: 5000,   // 5 seconds
  cookie: false
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinNodeRoom', (node_id) => {
    socket.join(node_id);
    console.log(`Client ${socket.id} joined room: ${node_id}`);
  });

  socket.on('sensorData', (data) => {
    console.log(`Received sensor data => ${data}`);
    const parsedData = JSON.parse(data);
    io.to(parsedData.node_id).emit('sensorData', data);
  });

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${reason}`);
  });
});

server.listen(8081, () => {
  console.log('Socket.IO server listening on port 8081');
});

module.exports = io;
