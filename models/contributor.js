var mongoose = require('mongoose');

module.exports = mongoose.model('Contributor', {
  uid : Number,
  name : String,
  avatar: String
});
