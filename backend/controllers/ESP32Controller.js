// ESP32Controller.js
const axios = require('axios');
const mqttClient = require('../mqtt.js');

let isSubscribed = false;
let sensorDataCache = {}; // 데이터를 캐시할 객체

function initializeMqtt() {
  if (!isSubscribed) {
    mqttClient.subscribe('smartfarm/sensor/#', function (err) {
      if (err) {
        console.error('Error subscribing to topic:', err);
      } else {
        console.log('Subscribed to topic: smartfarm/sensor/#');
        isSubscribed = true;
      }
    });

    mqttClient.on('message', function (topic, message) {
      if (topic.startsWith('smartfarm/sensor/')) {
        const sensorData = JSON.parse(message.toString());
        const nodeId = sensorData.node_id;
        sensorDataCache[nodeId] = sensorData; // 메시지 데이터를 저장
      }
    });
  }
}

initializeMqtt();

exports.findArduinos = async (req, res) => {
  try {
    const nodeIds = Object.keys(sensorDataCache); // 저장된 노드 ID 목록
    if (nodeIds.length > 0) {
      res.json(nodeIds);
    } else {
      res.status(404).send('No data available');
    }
  } catch (error) {
    console.error('Error in findArduinos:', error);
    res.status(500).send(error);
  }
};
