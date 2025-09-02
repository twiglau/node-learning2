const mongoose = require('mongoose');
const base = require('./base');

const subscribeScheme = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  channel: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  },
  ...base
})

module.exports = subscribeScheme