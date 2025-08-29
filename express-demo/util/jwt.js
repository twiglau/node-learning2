const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const { uuid } = require('../config/config.default')

const toJwt = promisify(jwt.sign)
const verifyJwt = promisify(jwt.verify)

module.exports.createToken = async user => {
  return await toJwt(
    {...user}, 
    uuid, 
    { expiresIn: 60 * 60 * 24 * 30}
  )
}


module.exports.verifyToken = async (req, res, next) => {
  var token = req.headers.authorization
  token = token ? token.split("Bearer ")[1] : null
  if(!token) {
    res.status(402).json({code: 402, message: '用户未登录'})
  }
  try {
    const user = await verifyJwt(token, uuid)
    
    req.user = user
    next()
  } catch (error) {
    res.status('402').json({code: 402, message: '无效token'})
  }
}
