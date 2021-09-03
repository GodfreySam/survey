const mongoose = require('mongoose');

const { Schema } = mongoose;

const surveySchema = new Schema({
   title: {
   type: String
   },
   description: {
      type: String
   },
   place: {
   type: String
   },
   start: {
   type: Date
   },
   end: {
   type: Date
   },
   userid: {
   type: String
   }
}, { timestamps: true });

const Survey = mongoose.model('survey', surveySchema);

module.exports = Survey;