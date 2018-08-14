var mongoose = require('mongoose');
var uuid = require('uuid/v1');
var workspace = require('./workspace');

module.exports = new mongoose.Schema({
  _id: { type: String, default: uuid },
  displayName: { type: String, required: true },
  name: { type: String, required: true, unique: true, dropDups: true },
  workspaces: [workspace]
});
