var express = require('express');
var router = express.Router();
var Admin = require('./controllers/Admin.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	req.session.user = 'rest';
	var data = req.session.user;
	res.render('index', {
		title: 'Matcha',
		created_by: 'Roman Malyavchik',
		logged_user: req.session.user_id,
		user_login: req.session.user_login
	});
});

router.get('/error', function(req, res, next) {
	res.render('error', {
		logged_user: req.session.user_id,
		error: req.query.error,
		image: req.query.image
	});
});

router.get('/admin', async function(req, res, next) {
	var curr_user = await User.findById(req.session.user_id).exec();
	if (!Admin.check_access(req, res, curr_user))
		return ;
	res.render('admin', {
		logged_user: req.session.user_id,
		user_login: req.session.user_login
	});
});

module.exports = router;
