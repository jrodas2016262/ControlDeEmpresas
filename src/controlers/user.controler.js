'use strict'

const Emp = require('../models/empresa.model')
const User = require('../models/user.model')
const bcrypt = require("bcrypt-nodejs")
const jwtU = require("../services/jwt.user")

function getAllUsers(req, res) {
    User.find((err, usersFind) =>{
        if(err) return res.status(500).send({ mensaje: 'Error al solicitar usuarios' })
        if(!usersFind) return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        return res.status(200).send({ usersFind })
    })
}

function loginUser(req, res) {
    var params = req.body

    User.findOne({ usuario: params.usuario }, (err, userFind) =>{
        if(err) return res.status(500).send({ mensaje: 'Usuario o contraseña incorrectos D:' })

        if (userFind) {
            if(params.usuario === 'Admin' && params.password === '123456'){
                return res.status(200).send({ token: jwtU.crearToken(userFind) })
            }
            bcrypt.compare(params.password, userFind.password, (err, correctPass) =>{
                if(correctPass){
                    return res.status(200).send({ token: jwtU.crearToken(userFind) })                    
                }else{
                    return res.status(500).send({ mensaje: 'Usuario o contraseña incorrectos ):' })
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Usuario o contraseña no encontrado' })
        }
    })
}

function createEmp(req, res) {
    var empModel = new Emp();
    var params = req.body;

    if (req.user.usuario != 'Admin') {
        return res.status(500).send({ mensaje: 'ERROR este usuario no puede crear nuevos usuarios' })
    }else{
        if(params.nombre && params.password) {
            empModel.nombre = params.nombre;
            empModel.direccion = params.direccion;
            empModel.descripcion = params.descripcion;

            Emp.find({ $or:[
                { nombre: empModel.nombre },
                { direccion: empModel.direccion }
            ] }).exec((err, empFind) =>{
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion de datos' })

                if(empFind && empFind.length >= 1) {
                    return res.status(500).send({ mensaje: 'Ya hay una empresa con este nombre y/o direccion' })
                }else{
                    bcrypt.hash(params.password, null, null, (err, passCrypt) =>{
                        empModel.password = passCrypt;

                        empModel.save((err, saveEmp) =>{
                            if(err) return res.status(500).send({ mensaje: 'ERROR al guardar la empresa' })

                            if(saveEmp) {
                                res.status(200).send({ saveEmp })
                            }else{
                                res.status(500).send({ mensaje: 'No se pudo registrar una nueva Empresa' })
                            }
                        })
                    })
                }
            })
        }
    }

}

function mainStart(req, res) {

    let userModel = new User();

    userModel.usuario = 'Admin'
    userModel.password = '123456'

    User.find({$or:[
        {usuario: userModel.usuario}
    ]}).exec((err, userFind)=>{
        if(err) return console.log("ERROR en la peticion")
        
        if(userFind && userFind.length>=1){
            console.log("Usuario Admin creado")
        }else{
            bcrypt.hash(userModel.password,null,null, (err, passCrypt)=>{
                userModel.password = passCrypt;
            })

            userModel.save((err,saveUser)=>{
                if(err) return console.log( "ERROR al crear el usuario Admin" )

                if(saveUser){
                    console.log( "Usuario Creado" + saveUser )
                }
            })
        }
    })
}

module.exports = {
    getAllUsers,
    loginUser,
    createEmp,
    mainStart
}