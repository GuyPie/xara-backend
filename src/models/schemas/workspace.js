var mongoose = require('mongoose');
var uuid = require('uuid/v1');
var user = require('./user');

module.exports = new mongoose.Schema({
  _id: { type: String, default: uuid },
  displayName: { type: String, required: true },
  name: { type: String, required: true },
  users: [user]
});
