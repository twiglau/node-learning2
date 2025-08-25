var express = require('express');
var router = express.Router();
var videoCtrl = require('../controller/video')

router
  .get('/list', videoCtrl.list)
  .get('/users', videoCtrl.users)

module.exports = router;
