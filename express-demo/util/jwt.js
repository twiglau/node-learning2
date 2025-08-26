const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const toJwt = promisify(jwt.sign)

module.exports.createToken = async user => {}