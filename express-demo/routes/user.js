var express = require('express');
var router = express.Router();
var userCtrl = require('../controller/user')
var userValidator = require('../middleware/validator/user')


router
  .post('/register',userValidator.register,userCtrl.register)
  .get('/list', userCtrl.list)
  .delete('/', userCtrl.delete);

module.exports = router;
