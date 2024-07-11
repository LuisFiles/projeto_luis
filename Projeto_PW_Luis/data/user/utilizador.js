const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let scopes = require("./scopes");

let roleSchema = new Schema ({
    name: {type: String, required:true},
    scopes : [{type: String, enum:[scopes["read-all"], scopes["read-posts"], scopes["manage-posts"]]}]
  });

const utilizadorSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: { type: roleSchema}
});

let utilizador = mongoose.model('utilizador', utilizadorSchema);

module.exports = utilizador;