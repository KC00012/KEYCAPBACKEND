const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   desc: {
      type: String,
      required: true
   },
   by: {
      type: String,
      required: true
   },
   theme: {
      type: String,
      required: true
   },
   comments: [
      {
         text: String,
         by: String,
         date: { type: Date, default: Date.now }
      }
   ]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema); // Changed to 'User' for consistency
