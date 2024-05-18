const express = require('express');
const router = express.Router();
const SensorDataController = require('../controllers/SensorDataController');

router.get('/', function(req, res) {
  res.send('Hello World!');
});

router.get('/sensor-data', SensorDataController.handleRequest);

module.exports = router;