var express = require('express');
var router = express.Router();
var user_controller = require('./controllers/User.js');

// var valid = require('./controllers/validators/user/valid_user.js');
var user = require('./models/User.js');

router.get('/login', function(req, res, next) {
  	res.render('auth/login', {error: req.query['error']});
});

router.get('/logout', function(req, res, next) {
	req.session.user_id = null;
	req.session.user_login = null;
	res.redirect('/users/login');
});

router.get('/register', function(req, res, next) {
  res.render('auth/register', {data: req.session.user});
});

router.get('/forgot', function(req, res, next) {
  res.render('auth/restore');
});

router.post('/valid', function(req, res, next) {
	if (req.body.page === 'register')
		user_controller.register(req, res);
	else if (req.body.page === 'login')
		user_controller.login(req, res);
	else
		res.redirect('/users/login');
});

router.get('/unique', function(req, res, next) {
	user_controller.is_unique(req.query, res);
});

module.exports = router;
