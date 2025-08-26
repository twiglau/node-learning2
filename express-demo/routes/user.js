var express = require('express');
var router = express.Router();
var userCtrl = require('../controller/user')
var userValidator = require('../middleware/validator/user')
const { validationResult } = require('express-validator')

router
  .post('/register',
  ...userValidator.register, 
  (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(401).json({
        code: 401,
        message: errors.array()[0].msg
      })
    }
    next()
  },
  userCtrl.register)
  .get('/list', userCtrl.list)
  .delete('/', userCtrl.delete);

module.exports = router;
