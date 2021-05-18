var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('gochat/index', { title: 'Go Chat' });
});

/* GET home page. */
router.get('/SignUp', function(req, res, next) {
    res.render('gochat/signup', { title: 'Go Chat' });
});

module.exports = router;