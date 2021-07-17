'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String,
    usuario: String,
    password: String,
    rol: String,
    departamento: String,
    empresa: String
})

module.exports = mongoose.model('usuarios', UserSchema)
