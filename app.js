'use strict'

const express = require("express");
const app  = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const user_ruta = require("./src/routes/user.routes")
const emp_ruta = require("./src/routes/empresa.routes")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());

app.use('/api', user_ruta)
app.use('/api', emp_ruta)

module.exports = app;
