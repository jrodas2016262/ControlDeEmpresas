'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'clave_secreta'

exports.ensureAuth = function (req, res, next) {
    if(!req.headers.authorization){
        return res.status(401).send({ mensaje: 'La peticion no tiene la cabecera Authorization' })
    }
    var token = req.headers.authorization.replace(/['"]+/g, '')
    try {
        var payloadE = jwt.decode(token, secret)
        if (payloadE.exp <= moment().unix()) {
            return res.status(401).send({ mensaje: 'El tiempo del token ha expirado' })
        }
    } catch (error) {
        return res.status(500).send({ mensaje: 'El token no es valido' })
    }

    req.empresa = payloadE;
    next();
}