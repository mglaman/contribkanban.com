var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require ('method-override');
var mongoose = require('mongoose');
var compression = require('compression');

var db = require('./config/db');
var port = process.env.PORT || 8080;
//mongoose.connect(db.url); 
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/dist'));
app.use(compression());
require('./routes')(app);
app.listen(port); 

exports = module.exports = app; 
