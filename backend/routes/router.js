const express = require('express');
const router = express.Router();
const SensorDataController = require('../controllers/SensorDataController');
const ESP32Controller = require('../controllers/ESP32Controller');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

router.get('/', function(req, res) {
  res.send('Hello World!');
});

router.get('/sensor-data', SensorDataController.handleRequest);

router.post('/add-esp32', ESP32Controller.addESP32);

router.get('/devices', async (req, res) => {
  try {
    const { stdout } = await exec('arp -a');
    const devices = stdout.split('\n')
      .map(line => line.split(' '))
      .filter(parts => parts[0].startsWith('192.168.1.'))
      .map(parts => ({ ip: parts[0] }));

    res.json(devices);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error fetching devices');
  }
});
module.exports = router;