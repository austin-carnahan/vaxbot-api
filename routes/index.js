var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/providers/metadata');
});

module.exports = router;
