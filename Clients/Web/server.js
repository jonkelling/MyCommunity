"use strict";

//module dependencies.
require("amd-loader");

var express = require("express");
//var app = require("./www");
//var debug = require("debug")("express:server");

var app = express();


app.use(express.static('.'));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.listen(process.env.PORT || 3000);