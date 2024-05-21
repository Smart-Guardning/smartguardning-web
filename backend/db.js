const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE access_control (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password TEXT NOT NULL
  );`);

  db.run(`CREATE TABLE nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active INTEGER DEFAULT 0
  );`);

  db.run(`CREATE TABLE sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id TEXT NOT NULL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    soil_moisture INTEGER,
    water_level INTEGER,
    temperature REAL,
    humidity REAL,
    waterpipe INTEGER,
    error_code INTEGER,
    FOREIGN KEY (node_id) REFERENCES nodes (node_id)
  );`);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});