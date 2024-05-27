const aedes = require('../mqtt.js'); // Adjust the path as necessary

const ESP32Controller = {
  addArduino: async (req, res) => {
  const id = req.body.id;

  // Publish the Arduino ID to the MQTT broker
  const packet = {
    topic: 'arduino/id',
    payload: id,
    qos: 0,
    retain: false
  };
  aedes.publish(packet, function(err) {
    if (err) {
      console.error(err);
      res.json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
}
};

module.exports = ESP32Controller;