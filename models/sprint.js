var mongoose = require('mongoose');

module.exports = mongoose.model('Sprint', {
  machine_name : String,
  title: String,
  nid: String,
  listConfig: Array,
  tid: Array
});
