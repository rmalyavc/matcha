var express = require('express');
var router = express.Router();
var Admin = require('./controllers/Admin.js');
var User = require('./models/User.js');
var install = require('./config/install.js');
var db = require('./config/connection.js');

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
	var sql = "SELECT * FROM users WHERE id = ?;";
	// var curr_user = await db.query(sql);
	
	// var curr_user = await User.findById(req.session.user_id).exec();
	db.query(sql, req.session.user_id, function(err, rows) {
		if (err) {
			res.redirect('/error?error=' + err);
			return ;
		}
		if (!Admin.check_access(req, res, rows[0]))
			return ;
		res.render('admin', {
			logged_user: req.session.user_id,
			user_login: req.session.user_login
		});
	});
});

router.get('/install', function(req, res) {
	install.install();
	res.redirect('/');
});

module.exports = router;
