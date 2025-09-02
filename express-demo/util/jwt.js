const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const { UUID } = require('../config/config.default')

const toJwt = promisify(jwt.sign)
const verifyJwt = promisify(jwt.verify)

module.exports.createToken = async user => {
  return await toJwt(
    {...user}, 
    UUID, 
    { expiresIn: 60 * 60 * 24 * 30}
  )
}


module.exports.verifyToken = function (required = true) {
  return async (req, res, next) => {
    var token = req.headers.authorization
    token = token ? token.split("Bearer ")[1] : null
    if(token) {
      try {
        const user = await verifyJwt(token, UUID)
        
        req.user = user
        next()
      } catch (error) {
        res.status('402').json({code: 402, message: '无效token'})
      }
    } else if(required){
      res.status(402).json({code: 402, message: '用户未登录'})
    } else {
      next()
    }
  }
}
