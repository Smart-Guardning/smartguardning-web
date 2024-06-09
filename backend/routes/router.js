const express = require('express');
const router = express.Router();
const ESP32Controller = require('../controllers/ESP32Controller');

router.get('/api/available-nodes', ESP32Controller.getAvailableNodes);
router.get('/api/arduinos', ESP32Controller.findArduinos);
router.get('/api/arduinos/:nodeId', ESP32Controller.getArduinoDetails);
router.get('/api/sensor-data/:nodeId', ESP32Controller.getSensorData);
router.post('/api/add-arduino', ESP32Controller.addArduino);

// node 통제
router.get('/api/control-pump/:node_id', ESP32Controller.controlPump);
router.post('/api/save-settings/:node_id', ESP32Controller.saveSettings);

module.exports = router;
