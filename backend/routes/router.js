const express = require('express');
const router = express.Router();
const ESP32Controller = require('../controllers/ESP32Controller');

router.get('/api/find-arduinos', ESP32Controller.findArduinos);
router.post('/api/add-arduino', ESP32Controller.addArduino);

module.exports = router;
