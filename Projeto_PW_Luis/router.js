const express = require('express');
let livroAPI = require('./server/livro');
let AuthAPI = require('./server/auth');
let reservasAPI = require('./server/reservas');

function initialize() {
    let api = express();

    api.use('/api', livroAPI());
    api.use('/auth', AuthAPI());
    api.use('/reservas', reservasAPI());
    return api;
}

module.exports = {
    initialize: initialize,
};