const mongoose = require('mongoose')
const {Schema, model} = mongoose

const UserSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  name: {
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true,
    select: false
  },
  avatar_url: {type: String},
  gender: {type: String, enum: ['male', 'female'], default: 'male'},
  headline: {type: String},
  locations: {type: [{type: Schema.Types.ObjectId, ref: 'Topic'}], select: false},
  business: {type: Schema.Types.ObjectId, ref: 'Topic', select: false},
  employments: {
    type: [{
      company: {type: Schema.Types.ObjectId, ref:'Topic'},
      job: {type: Schema.Types.ObjectId, ref: 'Topic'},
    }],
    select: false
  },
  educations: {
    type: [{
      school: {type: String},
      major: {type: String},
      diploma: {type: Number, enum: [1, 2, 3, 4, 5]},
      enterance_year: {type: Number},
      graduation_year: {type: Number}
    }],
    select: false
  },
  following: {
    type: [{type: Schema.Types.ObjectId, ref: 'User'}],
    select: false
  },
  followingTopics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic'}],
    select: false
  },
  likingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer'}],
    select: false
  },
  dislikingAnswers: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Answer'}],
    select: false
  }
})

module.exports = model('User', UserSchema)