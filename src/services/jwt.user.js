'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'secret'

exports.crearToken = function (usuario) {
    var payloadU = {
        sub: usuario._id,
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        rol: usuario.rol,
        departamento: usuario.departamento,
        empresa: usuario.empresa,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payloadU, secret);
}