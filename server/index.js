const http = require('http');
const express = require('express');
const config = require('./lib/config');
const socket = require('./lib/socket');

const app = express();
const server = http.createServer(app);

app.use('/', express.static(`${__dirname}/../build`));

server.listen(config.PORT, () => {
    socket(server);
    console.log('Server is listening at :', config.PORT);
});
