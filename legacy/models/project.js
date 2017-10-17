var mongoose = require('mongoose');

module.exports = mongoose.model('Project', {
  machine_name : String,
  versionFormat: String,
  nid: Number,
  title: String,
  projectType: String,
  projectComponents: Array,
  releaseBranches: Array
});
