const express = require('express');
const http = require('http');
let router = require('./router');
const config = require('./config');
const mongoose = require('mongoose');

const hostname = '127.0.0.10';
const port = 3000;


/*
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
    });
*/

var app = express();
const server = http.Server(app);
app.use(router.initialize());

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    });


    mongoose.connect(config.db)
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...'));