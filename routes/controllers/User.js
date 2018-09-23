var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test', { useNewUrlParser: true });
var User = require('../models/User.js');
var Photo = require('../models/Photo.js');
var user_validator = require('../validators/User.js');
var hash = require('password-hash');
var fs = require('fs');
var shell = require('shelljs');


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
	update: function (req, res) {
		var data = req.body;
		var error = '';
		if (data['user_id'] !== req.session.user_id) {
			res.render('error', {
				error: 'You cannot change another user\'s data!',
				image: '/images/fuck.png',
				logged_user: req.session.user_id
			});
			return ;
		}
		User.findById(data['user_id'], function (err, doc) {
			var error = '';
			var url = '/users/profile/' + data['user_id'] + '/';
			if ((err || !doc) && (url += '?err='))
				error = err ? err : 'User does not exist';
			else {
				doc.login = data['login'];
				doc.email = data['email'];
				doc.first_name = data['first_name'];
				doc.last_name = data['last_name'];
				doc.about = data['about'];
				doc.save().then(function() {
					res.redirect(url);
				}, function(err) {
					res.redirect(url + '?err=' + err);
				}).catch(function(error_catch) {
					if (error_catch)
						console.log(error_catch);
				});
			}
			res.redirect(url + error);
		});
	},
	upload: function(req, res) {
		var data = req.body;
		var today = new Date();
		var path = '/uploads/' + session.user_id + '/' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '/';
		if (!data['id'] || data['id'] !== req.session.user_id || !req.files.upload)
			res.send(false);
		else {
			User.findById(data['id'], function(err, doc) {
				if (err || !doc)
					res.send(false);
				else {
					if (!fs.existsSync(path))
						shell.mkdir('-p', path);
					req.files.upload.mv(path + req.files.upload.name, function(err) {
						if (err)
							res.send(false);
						else {
							photo = new Photo({url: path + req.files.upload.name});
							doc.push(photo);
							doc.save().then(function() {
								res.send(doc);
							}).catch(function(err) {
								res.send(false);
							});
						}
					});
				}
			});
			// res.send(true);
		}
	},
	is_unique: function(req, res) {
		var cond;

		if (req.query.login)
			cond = {login: req.query.login};
		else if (req.query.email)
			cond = {email: req.query.email};
		User.findOne(cond, function (err, doc) {
			if (err || (doc && doc.id !== req.session.user_id))
				res.send(false);
			else
				res.send(true);
		});
	},
	get_user: function(id, res) {
		User.findById(id, function (err, doc) {
			if (err || !doc)
				res.send(false);
			else
				res.send(doc);
		});
	},
	is_owner: function(id, res, req) {
		res.send(id === req.session.user_id);
	}
}