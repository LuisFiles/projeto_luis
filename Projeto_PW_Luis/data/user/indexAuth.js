const utilizador = require('./utilizador');
const utilizadorService = require('./authController');

const service = utilizadorService(utilizador);

module.exports = service;