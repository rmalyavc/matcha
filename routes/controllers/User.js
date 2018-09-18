var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
var User = require('../models/User.js');
var user_validator = require('../validators/User.js');
var hash = require('password-hash');

function is_email(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

module.exports = {
	register: function(req, res) {
		var data = req.body;
		if (!user_validator.valid_register_data(data)) {
			res.render('./auth/valid', {
				registred: false,
				error: 'Invalid data'
			});
		}
		else {
			var new_user = {
				login: data['login'],
				password: hash.generate(data['password'], {algorithm: 'sha256'}),
				email: data['email']
			}
			user = new User(new_user);
			user.save().then(function(record){
				req.session.user_id = record.id;
				req.session.user_login = record.login;
				res.render('./auth/valid', {
					registred: true,
					login: new_user['login']
				});
			}, function(err) {
				console	.log('test   ' + err);
				res.render('./auth/valid', {
					registred: false,
					error: err
				});
			});
		}
	},
	login: function(req, res) {
		var cond = {};

		if (is_email(req.body.login))
			cond.email = req.body.login;
		else if (req.body.login !== '' && req.body.login.length > 3)
			cond.login = req.body.login;
		else
			res.redirect('/users/login?error=Invalid login or email');
		User.findOne(cond, function (err, doc) {
			if (doc) {
				if (hash.verify(req.body.password, doc.password)) {
					req.session.user_id = doc.id;
					req.session.user_login = doc.login;
					res.redirect('/');
				}
				else
					res.redirect('/users/login?error=Invalid password');
			}
			else
				res.redirect('/users/login?error=Invalid login, email or password');
		});
	},
	is_unique: function(data, res) {
		var cond;

		if (data.login)
			cond = {login: data.login};
		else if (data.email)
			cond = {email: data.email};
		User.findOne(cond, function (err, doc) {
			if (err || doc)
				res.send(false);
			else
				res.send(true);
		});
	}
}