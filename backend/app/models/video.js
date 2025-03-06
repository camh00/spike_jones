var mongoose = require('mongoose');

var videoSchema = mongoose.Schema({
  title         : String,
  year          : String,
  people        : String,
});

module.exports = mongoose.model('Video', videoSchema);
