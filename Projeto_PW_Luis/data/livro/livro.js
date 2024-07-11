var mongoose = require('mongoose');

let Schema = mongoose.Schema;

var livroSchema = new Schema({
    titulo: {type: String, required: true},
    autor: {type: String,required: true},
    ano: {type: Number, required: true},
    categoria: {type: String,required: true}
});

let livro = mongoose.model('livro', livroSchema);

module.exports = livro;