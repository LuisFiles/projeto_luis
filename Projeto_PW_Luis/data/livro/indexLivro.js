const livro = require('./livro');
const livroController = require('./livroController');

const service = livroController(livro);

module.exports = service;