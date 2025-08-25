var express = require('express');
var router = express.Router();

router.get('/list', function(req, res, next) {
  console.log(req.method);
  console.log(JSON.parse('('))
  res.send('/video-list');
});

router.get('/users', (req, res) => {
  console.log(req.method);
  res.send('/users')
})

module.exports = router;
