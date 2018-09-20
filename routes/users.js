var express = require('express');
var router = express.Router();
var user_controller = require('./controllers/User.js');

// var valid = require('./controllers/validators/user/valid_user.js');
var User = require('./models/User.js');

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

router.get('/profile/:id', function(req, res, next) {
	var is_owner = (req.params.id === req.session.user_id);
	console.log(is_owner);

	User.findById(req.params.id, function (err, doc) {
		if (err || !doc)
			res.render('error', {message: 'User is not found'});
		else
			res.render('auth/profile', {
				user: doc,
				is_owner: is_owner
			});
	});
});

router.get('/ajax', function(req, res, next) {
	if (req.query['action'] === 'is_unique')
		user_controller.is_unique(req, res);

});



module.exports = router;
