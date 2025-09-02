var express = require('express');
var router = express.Router();
var userCtrl = require('../controller/user')
var userValidator = require('../middleware/validator/user')
const { verifyToken } = require('../util/jwt')
var multer = require('multer')
const uploadImage = multer({ dest: 'public/images/', limits: { fieldSize: 1024 * 1024 * 5}})
const uploadVideo = multer({ dest: 'public/videos/'})

router
  .get('/getuser/:userId', verifyToken(false), userCtrl.getuser)
  .get('/unsubscribe/:userId', verifyToken(), userCtrl.unsubscribe)
  .get('/subscribe/:userId', verifyToken(), userCtrl.subscribe)
  .post('/logins',userValidator.login,userCtrl.login)
  .post('/registers',userValidator.register,userCtrl.register)
  .get('/lists', verifyToken(), userCtrl.list)
  .post('/avatar', verifyToken(), uploadImage.single('avatar'), userCtrl.headerImg)
  .post('/video', verifyToken(), uploadVideo.single('video'), userCtrl.video)
  .put('/', verifyToken(), userValidator.update, userCtrl.update)
  .delete('/', userCtrl.delete);

module.exports = router;
