const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserSchema = Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// mongoose will create a section user (a sort of a table) using schema UserSchema
module.exports = User = mongoose.model('user', UserSchema);
