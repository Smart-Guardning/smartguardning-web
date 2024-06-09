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
    if (message.startsWith('{')) {
      // JSON 메시지인 경우
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.node_id) {
        ESP32Controller.addSensorData(parsedMessage);
        io.emit('newNode', parsedMessage.node_id);
      } else {
        console.error('Invalid sensor data format');
      }
    } else {
      // JSON이 아닌 메시지인 경우
      handleControlMessage(packet.topic, message);
    }
  } catch (error) {
    console.error('Error parsing MQTT message:', error);
  }
});

function handleControlMessage(topic, message) {
  const nodeId = topic.split('/')[2]; // 노드 ID 추출

  if (message.startsWith('TARGET_MOISTURE')) {
    const value = message.split(':')[1];
    console.log(`Setting target moisture for ${nodeId} to ${value}`);
  } else if (message.startsWith('AUTO_WATER')) {
    const value = message.split(':')[1];
    console.log(`Setting auto water for ${nodeId} to ${value}`);
  } else if (message.startsWith('WATER_DURATION')) {
    const value = message.split(':')[1];
    console.log(`Setting water duration for ${nodeId} to ${value}`);
  } else if (message.startsWith('MEASUREMENT_INTERVAL')) {
    const value = message.split(':')[1];
    console.log(`Setting measurement interval for ${nodeId} to ${value}`);
  } else if (message.startsWith('SLEEP')) {
    const value = message.split(':')[1];
    console.log(`Setting sleep mode for ${nodeId} to ${value}`);
  } else if (message === 'WATER_ON' || message === 'WATER_OFF') {
    console.log(`Received control message: ${message}`);
    io.emit('controlMessage', { topic, message });
  } else {
    console.error('Unknown message format');
  }
}
