// ESP32Controller.js
const axios = require('axios');
const mqttClient = require('../mqtt.js');

exports.findArduinos = async (req, res) => {
  try {
    mqttClient.subscribe('arduinos', function (err) {
      if (err) {
        console.error('Error subscribing to arduinos:', err);
        res.status(500).send(err);
      } else {
        mqttClient.on('message', function (topic, message) {
          if (topic === 'arduinos') {
            const arduinos = JSON.parse(message.toString());
            const nodeIds = arduinos.map(arduino => arduino.node_id); // node_id만 추출
            res.json(nodeIds);
          }
        });
      }
    });
  } catch (error) {
    console.error('Error in findArduinos:', error);
    res.status(500).send(error);
  }
};