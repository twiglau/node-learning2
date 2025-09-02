const mongoose = require('mongoose')
const base = require('./base')

const likeVideo = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  video: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Video'
  },
  like: {
    type: Number,
    enum: [1, -1],
    required: true
  },
  ...base
})

module.exports = likeVideo