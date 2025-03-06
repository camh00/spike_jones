var mongoose = require('mongoose');

var collectionSchema = mongoose.Schema({
  type          : String,
  name          : String,
  artist        : String,
  guests        : String,
  year          : String,
  label         : String,
  recordNumber  : String,
  tracks        : Array,
  download      : Boolean
});

module.exports = mongoose.model('Collection', collectionSchema);
