var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: Schema.Types.ObjectId,
  first_name: String,
  last_name: String,
  birthday: Date,
  marital_status: String
});

module.exports = mongoose.model('User', UserSchema);
