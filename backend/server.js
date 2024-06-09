const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/router');
require('./mqtt');
require('./websocket');

app.use(cors());
app.use(express.json());
app.use('/', router);

const server = app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000');
});

module.exports = server;
