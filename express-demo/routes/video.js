var express = require('express');
var router = express.Router();
var videoCtrl = require('../controller/video')
const { validatorVideo } = require('../middleware/validator/video')
const { verifyToken } = require('../util/jwt')

router
  .get('/likelist', verifyToken(), videoCtrl.likelist)
  .get('/dislike/:videoId', verifyToken(), videoCtrl.dislikeVideo)
  .get('/like/:videoId', verifyToken(), videoCtrl.likeVideo)
  .delete('/comment/:videoId/:commentId', videoCtrl.deleteComment)
  .get('/commentList/:videoId', verifyToken(), videoCtrl.commentList)
  .post('/comment/:videoId', verifyToken(), videoCtrl.comment)
  .get('/list', videoCtrl.list)
  .get('/:videoId', verifyToken(false), videoCtrl.videoDetail)
  .post('/create', verifyToken(), validatorVideo, videoCtrl.create)

module.exports = router;
