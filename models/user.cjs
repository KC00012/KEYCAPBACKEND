const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   name: {
      type: String,
      required: true,
      unique: true
   },
   pw: {
      type: String,
      required: true
   },
   desc: {
      type: String,
      required: true
   },
   color: {
      type: String,
      required: true
   },
   en: {
      type: String,
      required: true
   },
   rank: {
      type: String,
      required: true
   },
   bug: {
      type: Boolean,
      required: true
   },
   donator: {
      type: Boolean,
      required: true
   },
   game: {
      type: String,
      required: true
   },
   discord: {
      type: String
   },
   discord2: {
      type: String
   },
   ig: {
      type: String
   },
   xb: {
      type: String
   },
   ps: {
      type: String
   },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); // Changed to 'User' for consistency
