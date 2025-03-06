var mongoose = require('mongoose');

var sheetSchema = mongoose.Schema({
  title         : String,
  year          : String
});

module.exports = mongoose.model('Sheet', sheetSchema);
