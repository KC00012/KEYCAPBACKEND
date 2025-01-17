const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supportSchema = new Schema({
   email: {
      type: String,
      required: true
   },
   desc: {
      type: String,
      required: true
   },
}, { timestamps: true });

module.exports = mongoose.model('Support', supportSchema); // Changed to 'User' for consistency
