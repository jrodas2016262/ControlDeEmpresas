'use strict'

const Emp = require('../models/empresa.model')
const User = require('../models/user.model')
const bcrypt = require("bcrypt-nodejs")
const jwt = require("../services/jwt.empresas")
const console = require('console');
const pdf = require("html-pdf");

function getEmpresas(req, res) {
    Emp.find((err, empFind) =>{
        if(err) return res.status(500).send({ mensaje: 'Error al solicitar empresas' })
        if(!empFind) return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        return res.status(200).send({ empFind })
    })
}

function loginEmp(req, res) {
    var params = req.body

    Emp.findOne({ nombre: params.nombre }, (err, empFind) =>{
        if(err) return res.status(500).send({ mensaje: 'Empresa o contraseña incorrectos' })

        if (empFind) {
            bcrypt.compare(params.password, empFind.password, (err, correctPass) =>{
                if(correctPass){
                    return res.status(200).send({ token: jwt.createToken(empFind) })
                }else{
                    return res.status(500).send({ mensaje: 'Empresa o contraseña incorrectos' })
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Empresa o contraseña no encontrado' })
        }
    })
}

function createUser(req, res) {
    var usuarioModel = new User();
    var params = req.body;

    Emp.find({ nombre: req.empresa.nombre }, (err, findEmp) =>{
        if(err) return res.status(500).send({ mensaje: 'ERROR en la peticion' })
        
        if (findEmp) {
            if (params.usuario && params.password) {
                usuarioModel.nombre = params.nombre;
                usuarioModel.usuario = params.usuario;
                usuarioModel.rol = params.rol;
                usuarioModel.departamento = params.departamento;
                usuarioModel.empresa = req.empresa.sub;
        
                User.find({ $or: [
                    { usuario: usuarioModel.usuario }
                ] }).exec((err, usuariosEncontrados) =>{
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion de datos' });
                    
                    if(usuariosEncontrados && usuariosEncontrados.length >= 1) {
                        return res.status(500).send({ mensaje: 'El usuario ya existe' })
                    }else {
                        bcrypt.hash(params.password, null, null, (err, passwordEncriptada) =>{
                            usuarioModel.password = passwordEncriptada;
        
                            usuarioModel.save((err, usuarioGuardado) =>{
                                 if(err) return res.status(500).send({ mensaje: 'Error al guardar un nuevo usuario' })
        
                                if (usuarioGuardado) {
                                    res.status(200).send(usuarioGuardado)
                                }else{
                                    res.status(500).send({ mensaje: 'No se pudo registrar un nuevo usuario' })
                                }
                            })
                        })
                    }
                })
            }
        }else{
            return res.status(500).send({ mensaje: 'Solo las empresas pueden agregar usuarios' })
        }
    })


}

function editUser(req, res) {
    var idUser = req.params.idUser;
    var params = req.body;

    User.findOne({ _id: idUser, empresa: req.empresa.sub }, (err, findUser) =>{
        if(err) return res.status(500).send({ mensaje: 'ERROR en la peticion de datos' })

        if (findUser) {
            User.findByIdAndUpdate(idUser, params, { new: true }, (err, userFinded) =>{

            if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!userFinded) return res.status(500).send({ mensaje: 'Error al actualizar usuario' });
    
            return res.status(200).send({ userFinded });
            })
        }else{
            return res.status(500).send({ mensaje: `ERROR usuario no encontrado en ${req.empresa.nombre}` })
        }
    })
}

function deleteUsers(req, res) {
    const idUser = req.params.idUser;
    var params = req.body;

    User.findOne({ _id: idUser, empresa: req.empresa.sub }, (err, findUser) =>{
        if(err) return res.status(500).send({ mensaje: 'ERROR en la peticion de datos' })

        if (findUser) {
            User.findByIdAndDelete(idUser, (err, usuarioEliminado) =>{
                if(err) return res.status(500).send({ mensaje: 'Error en solicitar la eliminacion de usuario' });
                if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar usuario' });
        
                return res.status(200).send({ mensaje: `Se elimino al usuario de manera exitosa!` });
            })
        }else{
            return res.status(500).send({ mensaje: `ERROR usuario no encontrado en ${req.empresa.nombre}` })
        }
    })
}
 
function findByEmp(req, res) {
    User.find({ empresa: req.empresa.sub }, (err, userFinded) =>{
        if(err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })
        if(!userFinded) return res.status(500).send({ mensaje: 'No se encontro ningun registro en usuarios' })
        return res.status(200).send({ userFinded })
    })
}

function findEmpByID(req, res) {
    var idUser = req.params.idUser

    User.findOne({ empresa: req.empresa.sub, _id: idUser }, (err, userFinded) =>{
        if(err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })
        if(!userFinded) return res.status(500).send({ mensaje: 'No se encontro ningun usuario' })
        return res.status(200).send({ userFinded })
    })
}

function findEmpByName(req, res) {
    var nameEmp = req.params.nameEmp

    User.findOne({ empresa: req.empresa.sub, nombre: nameEmp }, (err, userFinded) =>{
        if(err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })
        if(!userFinded) return res.status(500).send({ mensaje: 'No se encontro ningun usuario' })
        return res.status(200).send({ userFinded })
    })
}

function findEmpByRol(req, res) {
    var idRol = req.params.idRol

    User.findOne({ empresa: req.empresa.sub, rol: idRol }, (err, userFinded) =>{
        if(err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })
        if(!userFinded) return res.status(500).send({ mensaje: 'No se encontro ningun usuario' })
        return res.status(200).send({ userFinded })
    })
}

function pdfByEmp(req, res) {
    var x = 0;
    var row = [];
    var content = '';
    var header = `
        <style>
            *{
                font-family: sans-serif;
                padding: 30px;
            }
            h1{
                text-align: center;
                border-bottom: 1px solid #A4A4A4;
                margin-top: 0px;
                padding-top: 0px;
            }
            table {
                border-collapse: collapse;
                background-color: white;
            }
            td, th{
                padding: 12px;
            }
            th{
                background-color: #5e5959;
                border-bottom: solid 5px #383838;
                color: white;
                text-align: justify;
            }
            tr:nth-child(even){
                background-color: #ddd;
            }
        </style>
    </head>
    <body>
        <h1>Usuarios ${ req.empresa.nombre }</h1>
        <table>
        <tr>
            <th>Id</th>
            <th>Nombre(s)</th>
            <th>Usuario</th>
            <th>Puesto</th>
            <th>Departamento</th>
        </tr>
    
    `;

    User.find({ empresa: req.empresa.sub }, (err, userFinded) =>{
        if(err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })
        if(!userFinded) return res.status(500).send({ mensaje: 'No se encontro ningun registro en usuarios' })

        while (x < userFinded.length) {
            row[x] = `
            <tr>
                <td>${ userFinded[x]._id }</td>
                <td>${ userFinded[x].nombre }</td>
                <td>${ userFinded[x].usuario }</td>
                <td>${ userFinded[x].rol }</td>
                <td>${ userFinded[x].departamento }</td>
            </tr>
            `;
            content+=row[x]
            x++;
        }
        content = header + content + '</table></body>'
        pdf.create(content).toFile(`./Listado_${ req.empresa.nombre }.pdf`, function(err, res) {
            if (err){
                console.log(err);
            } else {
                console.log(res);
            }
        })
        return res.status(200).send({ mensaje: 'Pdf creado con exito!' })
    })
}

module.exports = {
    createUser,
    getEmpresas,
    loginEmp,
    editUser,
    deleteUsers,
    findByEmp,
    findEmpByName,
    findEmpByID,
    findEmpByRol,
    pdfByEmp
}