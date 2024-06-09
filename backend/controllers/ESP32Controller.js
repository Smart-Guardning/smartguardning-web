const mqttClient = require('../mqtt.js');

let isSubscribed = false;
let sensorDataCache = {}; // 데이터를 캐시할 객체

// MQTT 초기화 함수
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

// addArduino 함수 수정
exports.addArduino = async (req, res) => {
  try {
    const { id } = req.body;
    // 노드를 추가한 후 MQTT 메시지 발행
    const topic = `smartfarm/sensor/${id}`;
    const message = JSON.stringify({ node_id: id, status: 'added' });
    mqttClient.publish(topic, message);

    console.log(`Arduino added: ${id}`);
    res.status(200).send(`Arduino added: ${id}`);
  } catch (error) {
    console.error('Error in addArduino:', error);
    res.status(500).send(error);
  }
};