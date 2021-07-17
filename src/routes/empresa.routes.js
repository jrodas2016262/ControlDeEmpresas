'use strict'

const express = require("express");
const empControler = require("../controlers/empresa.controler")
var md_autentication = require("../middlewares/authenticated.empresa");

var api = express.Router();
api.get('/getEmpresas', empControler.getEmpresas);
api.post('/loginEmp', empControler.loginEmp);
api.post('/createUser', md_autentication.ensureAuth, empControler.createUser);
api.put('/editUser/:idUser', md_autentication.ensureAuth, empControler.editUser);
api.delete('/deleteUsers/:idUser', md_autentication.ensureAuth, empControler.deleteUsers);
api.get('/findByEmp', md_autentication.ensureAuth, empControler.findByEmp);
api.get('/findEmpByName/:nameEmp', md_autentication.ensureAuth, empControler.findEmpByName);
api.get('/findEmpByID/:idUser', md_autentication.ensureAuth, empControler.findEmpByID);
api.get('/findEmpByRol/:idRol', md_autentication.ensureAuth, empControler.findEmpByRol);
api.get('/pdfByEmp', md_autentication.ensureAuth, empControler.pdfByEmp);

module.exports = api;
