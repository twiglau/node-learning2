var express = require('express');
var router = express.Router();
var userCtrl = require('../controller/user')
var userValidator = require('../middleware/validator/user')
const { verifyToken } = require('../util/jwt')

router
  .post('/logins',userValidator.login,userCtrl.login)
  .post('/registers',userValidator.register,userCtrl.register)
  .get('/lists', verifyToken, userCtrl.list)
  .delete('/', userCtrl.delete);

module.exports = router;
