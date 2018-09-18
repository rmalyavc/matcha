var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	req.session.user = 'rest';
	var data = req.session.user;
	res.render('index', {
		title: 'Matcha',
		created_by: 'Roman Malyavchik',
		logged_user: req.session.user_login,
		user_id: req.session.user_id,
	});
});

module.exports = router;
