// db.js
const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS access_control (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            password TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS nodes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id TEXT NOT NULL,
            description TEXT,
            is_active INTEGER DEFAULT 0
        )`);

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
        )`);
    }
});

module.exports = db;