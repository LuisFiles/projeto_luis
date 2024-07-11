const mongoose = require('mongoose');
const utilizador = require('./utilizador');

const reservaSchema = new mongoose.Schema({
    utilizador: {type: mongoose.Schema.Types.ObjectId, ref: 'utilizador', required:true},
    livro: {type: mongoose.Schema.Types.ObjectId, ref: 'livro', required:true},
    dataReserva: {type: Date, default: Date.now},
    dataVencimento: {type: Date, required: true},
    dataDevolucao: { type: Date },
    status: {type: String, enum: ['reservado', 'emprestado', 'devolvido'], default: 'reservado'}
});

let reservas = mongoose.model('reservas', reservaSchema);

module.exports = reservas;