const aedes = require('../mqtt.js'); // Adjust the path as necessary

const ESP32Controller = {
  addESP32: async (req, res) => {
    const ip = req.body.ip;

    // Publish the IP address to the MQTT broker
    const packet = {
      topic: 'esp32/ip',
      payload: ip, // Ensure the payload is a Buffer, string or stream
      qos: 0, // Quality of Service, you may want to use 1 or 2 depending on your needs
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