var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/v1/providers/metadata');
});

module.exports = router;
