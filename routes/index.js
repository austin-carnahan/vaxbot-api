var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/locations');
});

module.exports = router;
