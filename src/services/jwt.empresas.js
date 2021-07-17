'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'clave_secreta'

exports.createToken = function (empresa) {
    var payloadE = {
        sub: empresa._id,
        nombre: empresa.nombre,
        direccion: empresa.direccion,
        descripcion: empresa.descripcion,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payloadE, secret);
}