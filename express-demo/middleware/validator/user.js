const { body } = require('express-validator')
const validate = require('./error')
const { User } = require('../../model')


module.exports.register = validate(
  [
    body('username')
      .notEmpty().withMessage('用户名不能为空').bail()
      .isLength({min: 3}).withMessage('用户名长度不能超过3位').bail(),
    body('email')
      .notEmpty().withMessage('邮箱不能为空').bail()
      .isEmail().withMessage('邮箱格式不正确').bail()
      .custom(async email => {
         const emailExist = await User.findOne({email})
         if(emailExist) {
          return Promise.reject('邮箱已注册')
         }
      }).bail(),
    body('phone')
      .notEmpty().withMessage('手机号不能为空').bail()
      .custom(async phone => {
         const phoneExist = await User.findOne({phone})
         if(phoneExist) {
          return Promise.reject('手机号已注册')
         }
      }).bail(),
  ]
)

module.exports.login = validate([
  body('email')
      .notEmpty().withMessage('邮箱不能为空').bail()
      .isEmail().withMessage('邮箱格式不正确').bail()
      .custom(async email => {
         const emailExist = await User.findOne({email})
         if(emailExist) {
          return Promise.reject('邮箱已经被注册')
         }
      }).bail(),
  body('username')
     .custom(async username => {
        const userExist = await User.findOne({ username })
        if(userExist) {
          return Promise.reject('用户名已经被注册')
        }
     })
])


module.exports.update = validate([
  body('email')
    .notEmpty().withMessage('邮箱不能为空').bail()
])