var mongoose = require('mongoose');

module.exports.connect = function() {
  mongoose.connect('mongodb://localhost/business');
  var connection = mongoose.connection;

  connection.on('error', console.error.bind(console, 'connection error:'));
  connection.once('open', console.log.bind(console, 'connected to mongo'));

  return connection;
};
