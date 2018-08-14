var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
      },
      message: 'Please enter a valid email address!'
    } 
  },
  role: { type: String, required: true, enum: ['basic', 'admin'] }
});
