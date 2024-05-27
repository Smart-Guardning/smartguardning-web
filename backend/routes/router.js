const express = require('express');
const router = express.Router();
const ESP32Controller = require('../controllers/ESP32Controller');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

router.get('/', function(req, res) {
  res.send('Hello World!');
});


router.post('/api/add-arduino', ESP32Controller.addArduino);

module.exports = router;