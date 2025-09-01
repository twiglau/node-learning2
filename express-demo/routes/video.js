var express = require('express');
var router = express.Router();
var videoCtrl = require('../controller/video')
const { validatorVideo } = require('../middleware/validator/video')
const { verifyToken } = require('../util/jwt')


router
  .get('/list', videoCtrl.list)
  .post('/create', verifyToken, validatorVideo, videoCtrl.create)

module.exports = router;
