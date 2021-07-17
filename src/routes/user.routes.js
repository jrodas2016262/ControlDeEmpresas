'use strict'

const express = require("express");
const userControler = require("../controlers/user.controler")
var md_autentication = require("../middlewares/authenticated.user.js");

var api = express.Router();
api.get('/getAllUsers', userControler.getAllUsers);
api.post('/loginUser', userControler.loginUser);
api.post('/createEmp', md_autentication.ensureAuth, userControler.createEmp);
api.post('/mainStart', userControler.mainStart);

module.exports = api;
