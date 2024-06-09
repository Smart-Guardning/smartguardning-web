// controllers/ESP32Controller.js
const db = require('../db');
const mqttClient = require('../mqtt.js');

let isSubscribed = false;
let sensorDataCache = {};

function initializeMqtt() {
    if (!isSubscribed) {
        mqttClient.subscribe('smartfarm/sensor/#', function (err) {
            if (err) {
                console.error('Error subscribing to topic:', err);
            } else {
                console.log('Subscribed to topic: smartfarm/sensor/#');
                isSubscribed = true;
            }
        });

        mqttClient.on('message', function (topic, message) {
            if (topic.startsWith('smartfarm/sensor/')) {
                const sensorData = JSON.parse(message.toString());
                const nodeId = sensorData.node_id;
                sensorDataCache[nodeId] = sensorData;

                // Save data to database
                const { soil_moisture, water_level, temperature, humidity, waterpipe, error_code } = sensorData;
                const timestamp = new Date().toISOString();
                db.run(`INSERT INTO sensor_data (node_id, timestamp, soil_moisture, water_level, temperature, humidity, waterpipe, error_code)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [nodeId, timestamp, soil_moisture, water_level, temperature, humidity, waterpipe, error_code], (err) => {
                        if (err) {
                            console.error('Error inserting sensor data into database:', err);
                        } else {
                            console.log('Sensor data inserted into database.');
                        }
                    });
            }
        });
    }
}

initializeMqtt();

exports.findArduinos = async (req, res) => {
    try {
        const nodeIds = Object.keys(sensorDataCache);
        if (nodeIds.length > 0) {
            res.json(nodeIds);
        } else {
            res.status(404).send('No data available');
        }
    } catch (error) {
        console.error('Error in findArduinos:', error);
        res.status(500).send(error);
    }
};

exports.addArduino = async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            // Add node to the database
            db.run(`INSERT INTO nodes (node_id, is_active) VALUES (?, 1)`, [id], function (err) {
                if (err) {
                    console.error('Error adding Arduino to database:', err);
                    res.status(500).send('Error adding Arduino to database');
                } else {
                    console.log('Arduino added to database with ID:', id);
                    res.status(200).send('Arduino added successfully');
                }
            });
        } else {
            res.status(400).send('Invalid request');
        }
    } catch (error) {
        console.error('Error in addArduino:', error);
        res.status(500).send(error);
    }
};
