const express = require('express');
let livroAPI = require('./server/livro');
let AuthAPI = require('./server/auth');

function initialize() {
    let api = express();

    api.use('/api', livroAPI());
    api.use('/auth', AuthAPI());
    return api;
}

module.exports = {
    initialize: initialize,
};