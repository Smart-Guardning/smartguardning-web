const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        // Create access_control table
        db.run(`CREATE TABLE IF NOT EXISTS access_control (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            password TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error(err.message);
            }
        });

        // Create nodes table
        db.run(`CREATE TABLE IF NOT EXISTS nodes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id TEXT NOT NULL UNIQUE,
            description TEXT,
            is_active INTEGER DEFAULT 0
        )`, (err) => {
            if (err) {
                console.error(err.message);
            }
        });

        // Create sensor_data table
        db.run(`CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id TEXT NOT NULL,
            timestamp TEXT,
            soil_moisture INTEGER,
            water_level INTEGER,
            temperature REAL,
            humidity REAL,
            waterpipe INTEGER,
            error_code INTEGER,
            FOREIGN KEY(node_id) REFERENCES nodes(node_id)
        )`, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }
});

module.exports = db;
