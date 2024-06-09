const express = require('express');
const app = express();
const router = require('./routes/router');
const cors = require('cors');
const db = require('./db.js'); // Import db.js to initialize the database

app.use(cors( { origin: '*' } ));
app.use(express.json());
app.use('/', router);

// Import mqtt and websocket modules
require('./mqtt.js');
require('./websocket.js');

const server = app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000');
});
server.timeout = 0;
module.exports = server;
