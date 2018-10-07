var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test', { useNewUrlParser: true });
var User = require('../models/User.js');
var Photo = require('../models/Photo.js');
var user_validator = require('../validators/User.js');
var hash = require('password-hash');
var fs = require('fs');
var shell = require('shelljs');
var multer  = require('multer');


function is_email(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function get_upload_path(id) {
	if (!id)
		return (false);
	var today = new Date();
	return ('public/uploads/' + id + '/' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '/');
}

function get_extension(file) {
	if (!file)
		return (null);
	var ext = file.mimetype.split("/");
    return ('.' + ext[ext.length - 1]);
}

function is_image(ext) {
	return (ext === '.jpg' || ext === '.jpeg' || ext === '.jpe' || ext === '.png' || ext === '.gif');
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
			if (data['login'] === 'root')
				new_user['admin'] = true;
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
			res.redirect('/error?error=' + 'You cannot change another user\'s data!' + '&image=' + '/images/fuck.png');
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
					console.log(error_catch);
				});
			}
			res.redirect(url + error);
		});
	},
	upload: function(req, res) {
		var data = req.body;
		var file = req.files[0];
		var path = get_upload_path(req.session.user_id);
		console.log(file);
		if (!data['user_id'] || data['user_id'] !== req.session.user_id || !req.files) {
			res.send({
				success: false,
				errors: ['Invalid User Id']
			});
			return ;
		}
		else if (!is_image(get_extension(file))) {
			res.send({
				success: false,
				errors: ['Only JPEG, PNG or GIF files are allowed']
			});
			return ;
		}
		else {			
			User.findById(data['user_id'], function(err, doc) {
				if (err || !doc) {
					res.send({
						success: false,
						errors: ['Unable to find user', err],
					});
					return ;
				}
				else {
					if (!fs.existsSync(path))
						shell.mkdir('-p', path);
					shell.mv(file.path, path + file.filename + get_extension(file));
					doc.photo.push(new Photo({
						url: path + file.filename + get_extension(file),
						avatar: false,
					}));
					doc.save().then(function() {
						res.send({
							success: true,
							data: doc
						});
						return ;
					}).catch(function(err) {
						console.log(err);
						res.send({
							success: false,
							errors: [err]
						});
						return ;
					});
				}
			});
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
		res.send(id !== '' && id === req.session.user_id);
	},
	get_images: function(id_list, res) {
		Photo.find({}).exec(function(err, docs) {
			console.log('Docs are ');
			console.log(docs);
			console.log('Error is ');
			console.log(err);
			if (err || !docs) {
				res.send({
					success: false,
					err: err
				});
				return ;
			}
			else {
				res.send({
					success: true,
					images: docs
				});
			}
		});
	}
}