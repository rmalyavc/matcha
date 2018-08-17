var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

router.get('/register', function(req, res, next) {
  res.render('auth/register');
});

router.get('/forgot', function(req, res, next) {
  res.render('auth/restore');
});

module.exports = router;
