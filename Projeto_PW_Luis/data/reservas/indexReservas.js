const reservas = require('./reservas');
const reservasController = require('./reservasController');

const service = reservasController(reservas);

module.exports = service;