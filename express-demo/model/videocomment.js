const mongoose = require('mongoose');
const base = require('./base');

const videoComment = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  video: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'Video'
  },
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  ...base
})

module.exports = videoComment