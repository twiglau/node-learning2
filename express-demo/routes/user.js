var express = require('express');
var router = express.Router();


router.get('/list', function(req,res,next) {
  res.send('user list')
});



module.exports = router;
