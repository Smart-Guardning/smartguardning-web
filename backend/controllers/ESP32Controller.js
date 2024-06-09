const db = require('../db.js');

exports.addSensorData = (sensorData) => {
  const { node_id, soil_moisture, water_level, temperature, humidity, waterpipe, error_code } = sensorData;

  db.get('SELECT * FROM nodes WHERE node_id = ?', [node_id], (err, row) => {
    if (err) {
      console.error('DB Error:', err);
      return;
    }
    if (row) {
      const query = `INSERT INTO sensor_data (node_id, timestamp, soil_moisture, water_level, temperature, humidity, waterpipe, error_code) VALUES (?, datetime('now', 'localtime'), ?, ?, ?, ?, ?, ?)`;
      db.run(query, [node_id, soil_moisture, water_level, temperature, humidity, waterpipe, error_code], function (err) {
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
