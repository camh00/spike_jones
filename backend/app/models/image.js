var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
  title         : String,
  year          : String,
  people        : String,
  location      : String,
});

module.exports = mongoose.model('Image', imageSchema);
