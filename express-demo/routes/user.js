var express = require('express');
var router = express.Router();
var userCtrl = require('../controller/user')
var userValidator = require('../middleware/validator/user')


router
  .post('/logins',userValidator.login,userCtrl.login)
  .post('/registers',userValidator.register,userCtrl.register)
  .get('/lists', userCtrl.list)
  .delete('/', userCtrl.delete);

module.exports = router;
