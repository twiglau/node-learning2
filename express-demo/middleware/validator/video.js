
const { body } = require('express-validator')
const validate = require('./error')

module.exports.validatorVideo = validate([
  body('title')
    .notEmpty().withMessage('视频标题不能为空').bail()
    .isLength({ max: 30 }).withMessage('视频标题最长30位').bail(),
  body('videoUrl')
    .notEmpty().withMessage('视频Url不能为空').bail()
])