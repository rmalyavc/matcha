var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('auth/login', {login: true, data: req.session.user});
});

router.get('/register', function(req, res, next) {
  res.render('auth/register', {data: req.session.user});
});

router.get('/forgot', function(req, res, next) {
  res.render('auth/restore');
});

router.post('/valid', function(req, res, next) {
	data = req.body;
	res.render('auth/valid', {
		login: data.login
	});
})

module.exports = router;
