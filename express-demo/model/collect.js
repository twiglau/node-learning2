const mongoose = require('mongoose')
const base = require('./base')

const collectSchema = new mongoose.Schema({
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
  ...base
})

module.exports = collectSchema