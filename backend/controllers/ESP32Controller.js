const db = require('../db.js');
const mqtt = require('mqtt');

let availableNodes = {}; // 사용할 수 있는 노드를 저장하는 객체

// MQTT 클라이언트 설정
const mqttClient = mqtt.connect('mqtt://192.168.1.243:1884');

exports.addSensorData = (sensorData) => {
  const { node_id, soil_moisture, water_level, temperature, humidity, waterpipe, battery_level, error_code } = sensorData;

  // 새로운 노드 ID를 추가
  availableNodes[node_id] = {
    node_id,
    description: `Description for ${node_id}`
  };

  db.get('SELECT * FROM nodes WHERE node_id = ?', [node_id], (err, row) => {
    if (err) {
      console.error('DB Error:', err);
      return;
    }
    if (row) {
      const query = `INSERT INTO sensor_data (node_id, timestamp, soil_moisture, water_level, temperature, humidity, waterpipe, battery_level, error_code) VALUES (?, datetime('now', 'localtime'), ?, ?, ?, ?, ?, ?, ?)`;
      db.run(query, [node_id, soil_moisture, water_level, temperature, humidity, waterpipe, battery_level, error_code], function (err) {
        if (err) {
          console.error('DB Error:', err);
        } else {
          console.log(`Sensor data added for node_id: ${node_id}`);
        }
      });
    } else {
      console.log(`Node ID ${node_id} not found in nodes table.`);
    }
  });
};

exports.getAvailableNodes = (req, res) => {
  res.json({ data: Object.values(availableNodes) });
};

exports.findArduinos = (req, res) => {
  db.all('SELECT * FROM nodes', [], (err, rows) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).send(err);
    }
    res.json({ data: rows });
  });
};

exports.getArduinoDetails = (req, res) => {
  const nodeId = req.params.nodeId;
  db.get('SELECT * FROM nodes WHERE node_id = ?', [nodeId], (err, row) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).send(err);
    }
    if (!row) {
      return res.status(404).send('Node not found');
    }
    res.json(row);
  });
};

exports.getSensorData = (req, res) => {
  const nodeId = req.params.nodeId;
  db.all('SELECT * FROM sensor_data WHERE node_id = ?', [nodeId], (err, rows) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).send(err);
    }
    res.json(rows);
  });
};

exports.addArduino = (req, res) => {
  const { node_id, description } = req.body;
  if (!node_id) {
    return res.status(400).send('Node ID is required');
  }

  const query = `INSERT INTO nodes (node_id, description, is_active) VALUES (?, ?, ?)`;
  db.run(query, [node_id, description, 1], function (err) {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).send(err);
    }
    res.status(201).send('Arduino added successfully');
  });
};

exports.controlPump = (req, res) => {
  const nodeId = req.params.node_id;
  const action = req.query.action; 

  if (action === 'on' || action === 'off') {
    const topic = `smartfarm/commands/${nodeId}`;
    const message = action === 'on' ? 'WATER_ON' : 'WATER_OFF';
    mqttClient.publish(topic, message, () => {
      res.status(200).send(`Pump turned ${action}`);
    });
  } else {
    res.status(400).send('Invalid action');
  }
};

exports.saveSettings = (req, res) => {
  const nodeId = req.params.node_id;
  const settings = req.body;
  const topic = `smartfarm/settings/${nodeId}`;

  const settingsMessages = [
    `TARGET_MOISTURE:${settings.targetMoisture}`,
    `AUTO_WATER:${settings.autoWater === 'ON' ? 'ON' : 'OFF'}`,
    `WATER_DURATION:${settings.wateringDuration}`,
    `MEASUREMENT_INTERVAL:${settings.measurementInterval}`,
    `SLEEP:${settings.sleepMode === 'ON' ? 'ON' : 'OFF'}`
  ];

  settingsMessages.forEach(message => {
    mqttClient.publish(topic, message, (err) => {
      if (err) {
        console.error('Failed to publish MQTT message:', err);
      }
    });
  });

  res.status(200).send('Settings saved');
};
