var express = require('express');
var router = express.Router();
var videoCtrl = require('../controller/video')
const { validatorVideo } = require('../middleware/validator/video')
const { verifyToken } = require('../util/jwt')


router
  .get('/list', videoCtrl.list)
  .get('/:videoId', videoCtrl.videoDetail)
  .post('/create', verifyToken, validatorVideo, videoCtrl.create)

module.exports = router;
