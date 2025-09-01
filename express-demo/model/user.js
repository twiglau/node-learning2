const mongoose = require('mongoose');
const md5 = require('../util/md5')
const base = require('./base')

const userScheme = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    set:value => md5(value),
    select: false // 默认不返回
  },
  phone: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  channeldes: {
    type: String,
    default: null
  },
  ...base
})

module.exports = userScheme