var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var compression = require('compression');
var db = require('./config/db');

app.locals.docroot = __dirname + '/dist';

var dbUri = db.local;
if (process.env.NODE_ENV == 'production') {
  dbUri = db.prod;
}
mongoose.connect(dbUri);
console.log('Using db uri: ' + dbUri);


app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compression());

console.log('Using docroot: ' + app.locals.docroot);
app.use(express.static(app.locals.docroot));

require('./routes')(app);

app.listen(process.env.PORT || 8080);

exports = module.exports = app;
