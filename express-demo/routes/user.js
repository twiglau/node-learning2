var express = require('express');
var router = express.Router();
var userCtrl = require('../controller/user')

router
  .post('/register', userCtrl.register)
  .get('/list', userCtrl.list)
  .delete('/', userCtrl.delete);

module.exports = router;
