const mongoose = require('mongoose');
const md5 = require('../util/md5')
const base = require('./base')

const userScheme = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type:String,
    required: false
  },
  videoUrl: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  cover: {
    type: String,
    required: false
  },
  commentCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  dislikeCount: {
    type: Number,
    default: 0
  },
  ...base
})

module.exports = userScheme