// Importer file to help migrate from Parse.com to local MongoDB
var mongoose = require('mongoose');
var db = require('./config/db');
var Project = require('./models/project');

var dbUri = db.local;
if (process.env.NODE_ENV == 'production') {
  dbUri = db.prod;
}
mongoose.connect(dbUri);
console.log('Using db uri: ' + dbUri);

var args = process.argv.slice(2);
var json = require(args[0]).results;

json.forEach(function (entry) {
  var project = new Project(entry);
  project.save(function (err) {
    if (err) console.log(err);
    console.log('Imported ' + project.title);
  });
});
