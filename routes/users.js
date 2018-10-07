var express = require('express');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'tmp/' });
var router = express.Router();
var user_controller = require('./controllers/User.js');
var Admin = require('./controllers/Admin.js');

// var valid = require('./controllers/validators/user/valid_user.js');
var User = require('./models/User.js');

router.get('/login', function(req, res, next) {
  	res.render('auth/login', {
  		error: req.query['error'],
  		logged_user: req.session.user_id
  	});
});

router.get('/logout', function(req, res, next) {
	req.session.user_id = null;
	req.session.user_login = null;
	res.redirect('/users/login');
});

router.get('/register', function(req, res, next) {
	if (req.session.user_id)
		res.redirect('/users/logout');
	res.render('auth/register', {data: req.session.user});
});

router.post('/update', function(req, res, next) {
	user_controller.update(req, res);
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

	User.findById(req.params.id, function (err, doc) {
		if (err || !doc)
			res.render('error', {message: 'User is not found'});
		else {
			var error = req.query['err'] ? req.query['err'] : false;
			res.render('auth/profile', {
				user: doc,
				is_owner: is_owner,
				err: error,
				logged_user: req.session.user_id
			});
		}
	});
});

router.get('/ajax', async function(req, res, next) {
	console.log(req.query);
	if (req.query['action'] === 'is_unique')
		user_controller.is_unique(req, res);
	else if (req.query['action'] === 'is_owner' && req.query['id'])
		user_controller.is_owner(req.query['id'], res, req);
	else if (req.query['action'] === 'get_user' && req.query['id'])
		user_controller.get_user(req.query['id'], res);
	else if (req.query['action'] === 'get_all_users')
		Admin.get_all_users(req, res);
	else if (req.query['action'] === 'del_user' && req.query['id']) {
		var curr_user = await User.findById(req.session.user_id).exec();
		if (!Admin.check_access(req, res, curr_user))
			return ;
		Admin.del_user(req, res);
	}
});

router.post('/ajax_post', upload.any(), function(req, res, next) {
	// console.log(req.body);
	console.log(req.body['id_list[]']);
	// console.log(req.files);
	if (req.body['action'] === 'upload_photo' && req.body['user_id'] === req.session.user_id && req.files)
		user_controller.upload(req, res);
	else if (req.body['action'] === 'get_images' && req.body['id_list[]'] && req.body['id_list[]'].length > 0) {
		console.log('CONDITION PASSED');
		user_controller.get_images(req.body['id_list[]'], res);
	}
});

module.exports = router;
