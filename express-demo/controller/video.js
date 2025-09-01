
const fs = require('fs')
const ossUpload = require('../util/oss')
const { promisify } = require('util')
const rename = promisify(fs.rename)

exports.list = async (req, res) => {
  res.send('/video/list')
}

exports.users = async (req, res) => {
  res.send('/video/users')
}

exports.create = async (req, res) => {

  console.log(req.body)
  res.send('/video/create')
}