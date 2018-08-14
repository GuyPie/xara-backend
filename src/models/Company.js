var mongoose = require('mongoose');
var company = require('./schemas/company');

module.exports = mongoose.model('Company', company);
