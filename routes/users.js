var express = require('express');
var router = express.Router();
var user_controller = require('./controllers/User.js');

// var valid = require('./controllers/validators/user/valid_user.js');
var user = require('./models/User.js');

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
	user_controller.register(data, res);
	// var cont = {};
	// var my_res = false;
	// if (user.register(data, cont))
	// 	my_res = true;
	// res.render('auth/valid', {
	// 	login: data.login,
	// 	registred: my_res,
	// 	test: cont['test']
	// });
});

module.exports = router;
