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
    required: true
  },
  ...base
})

module.exports = userScheme