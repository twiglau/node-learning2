var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

  // 方式： 
  // res.send('');
  // res.download();
  // res.end();
  // res.json();
  // res.redirect();
  // res.sendStatus();
  // res.status(200).json();
  res.render('index', { title: 'Express' });
});

router.use('/user', require('./user'))
router.use('/video', require('./video'))


module.exports = router;
