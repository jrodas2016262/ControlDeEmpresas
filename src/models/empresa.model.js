'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String,
    password: String,
    direccion: String,
    descripcion: String
})

module.exports = mongoose.model('empresas', UserSchema)
