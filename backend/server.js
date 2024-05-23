const express = require('express');
const app = express();
const router = require('./routes/router');

// Import mqtt and websocket modules
require('./mqtt.js');
require('./websocket.js');

app.use(express.json());
app.use('/', router);

const server = app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000');
});


module.exports = server;