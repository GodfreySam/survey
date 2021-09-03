const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
   firstname: {
   type: String
   },
   lastname: {
   type: String
   },
   email: {
   type: String
   },
   phone: {
   type: Number
   },
   userID: {
   type: String
   }
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

module.exports = User;