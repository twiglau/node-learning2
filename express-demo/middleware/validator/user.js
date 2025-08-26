const { body } = require('express-validator')

module.exports.register = [
  body('username')
    .notEmpty().withMessage('用户名不能为空').bail()
    .isLength({min: 3}).withMessage('用户名长度不能超过3位'),
  body('email')
    .notEmpty()
    .isEmail()
]