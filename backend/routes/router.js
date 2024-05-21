const express = require('express');
const router = express.Router();
const SensorDataController = require('../controllers/SensorDataController');
const ESP32Controller = require('../controllers/ESP32Controller');

router.get('/', function(req, res) {
  res.send('Hello World!');
});

router.get('/sensor-data', SensorDataController.handleRequest);

router.post('/add-esp32', ESP32Controller.addESP32);

module.exports = router;