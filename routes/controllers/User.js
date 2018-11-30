var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test', { useNewUrlParser: true });
// var User = require('../models/User.js');
// var Photo = require('../models/Photo.js');
// var Comment = require('../models/Comment.js');
// var Like = require('../models/Like.js');
var user_validator = require('../validators/User.js');
var hash = require('password-hash');
var fs = require('fs');
var shell = require('shelljs');
var multer  = require('multer');
var db = require('../config/connection.js');


function is_email(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function get_upload_path(id) {
	if (!id)
		return (false);
	var today = new Date();
	return ('/uploads/' + id + '/' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '/');
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
			var sql = "INSERT INTO users SET ?";
			var new_user = {
				login: data['login'],
				password: hash.generate(data['password'], {algorithm: 'sha256'}),
				email: data['email'],
				admin: data['login'] === 'root' ? true : false
			}
			db.query(sql, new_user, function(err, results) {
				console.log('Results are: ');
				console.log(results);
				if (err) {
					res.render('./auth/valid', {
						registred: false,
						error: err
					});
					return ;
				}
				req.session.user_id = results.insertId;
				req.session.user_login = data['login'];
				res.render('./auth/valid', {
					registred: true,
					login: new_user['login']
				});
			});
		}
	},
	login: function(req, res) {
		var sql = "SELECT id, login, password FROM users WHERE login = ? OR email = ?;";

		db.query(sql, [req.body.login, req.body.login], function(err, result) {
			if (err)
				res.redirect('/users/login?error=' + err);
			else {
				if (result.length == 0) {
					res.redirect('/users/login?error=Invalid login or email');
					return ;
				}
				var user = result[0];
				if (hash.verify(req.body.password, user.password)) {
					req.session.user_id = user.id;
					req.session.user_login = user.login;
					res.redirect('/');
				}
				else
					res.redirect('/users/login?error=Invalid password');
			}
		});
	},
	update: function (req, res) {
		var data = req.body;
		// var error = '';
		if (data['user_id'] != req.session.user_id) {
			res.redirect('/error?error=You cannot change another user\'s data!&image=/images/fuck.png');
			return ;
		}
		var url = '/users/profile/' + data['user_id'];
		var sql = "UPDATE users SET ? WHERE id = ?;";
		var user = {
			login: data['login'],
			email: data['email'],
			first_name: data['first_name'],
			last_name: data['last_name'],
			about: data['about'],
			gender: data['gender'],
			orientation: data['orientation']
		}
		data['age'] ? user.age = data['age'] : false;
		db.query(sql, [user, data['user_id']], function(err) {
			if (err) {
				// console.log(err);
				res.redirect('/error?error=' + err);
			}
			else
				res.redirect(url);
		});
		// User.findById(data['user_id'], function(err, doc) {
		// 	var error = '';
		// 	var url = '/users/profile/' + data['user_id'] + '/';
		// 	if ((err || !doc) && (url += '?err='))
		// 		error = err ? err : 'User does not exist';
		// 	else {
		// 		doc.login = data['login'];
		// 		doc.email = data['email'];
		// 		doc.first_name = data['first_name'];
		// 		doc.last_name = data['last_name'];
		// 		doc.about = data['about'];
		// 		doc.save().then(function() {
		// 			res.redirect(url);
		// 			return ;
		// 		}, function(err) {
		// 			res.redirect(url + '?err=' + err);
		// 		}).catch(function(error_catch) {
		// 			console.log(error_catch);
		// 		});
		// 	}
		// 	res.redirect(url + error);
		// });
	},
	upload: function(req, res) {
		var data = req.body;
		var file = req.files[0];
		var path = get_upload_path(req.session.user_login);
		if (!data['user_id'] || data['user_id'] != req.session.user_id || !req.files) {
			res.send({
				success: false,
				errors: ['Invalid data']
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
			if (!fs.existsSync('public' + path))
				shell.mkdir('-p', 'public' + path);
			shell.mv(file.path, 'public' + path + file.filename + get_extension(file));

			var sql = "INSERT INTO photo SET ?";
			var photo = {
				user_id: data['user_id'],
				url: path + file.filename + get_extension(file)
			}

			db.query(sql, photo, function(err) {
				if (err) {
					res.send({
						success: false,
						error: err
					});
				}
				else
					res.send({success: true});
			});
			// User.findById(data['user_id'], function(err, doc) {
			// 	if (err || !doc) {
			// 		res.send({
			// 			success: false,
			// 			errors: ['Unable to find user', err],
			// 		});
			// 		return ;
			// 	}
			// 	else {
			

			// doc.photo.push(new Photo({
			// 	url: path + file.filename + get_extension(file),
			// 	avatar: false,
			// }));
			// doc.save().then(function() {
			// 	res.send({
			// 		success: true,
			// 		data: doc
			// 	});
			// 	return ;
			// }).catch(function(err) {
			// 	console.log(err);
			// 	res.send({
			// 		success: false,
			// 		errors: [err]
			// 	});
			// 	return ;
			// });
		}
			// });
		// }
	},
	is_unique: function(req, res) {
		if (!req.query.login && !req.query.email) {
			res.send(false);
			return ;
		}
		var login = req.query.login ? req.query.login : req.query.email;
		var sql = "SELECT id FROM users WHERE login = ? OR email = ?;";

		db.query(sql, [login, login], function(err, rows) {
			if (err || rows.length > 0)
				res.send(false);
			else
				res.send(true);
		});
		// var cond;

		// if (req.query.login)
		// 	cond = {login: req.query.login};
		// else if (req.query.email)
		// 	cond = {email: req.query.email};
		// User.findOne(cond, function (err, doc) {
		// 	if (err || (doc && doc.id !== req.session.user_id))
		// 		res.send(false);
		// 	else
		// 		res.send(true);
		// });
	},
	get_user: function(id, res) {
		var sql = "SELECT * FROM users WHERE id = ?;";

		db.query(sql, [id], function(err, rows) {
			if (err || rows.length < 1)
				res.send(false);
			else
				res.send(rows[0]);
		});
		// User.findById(id, function (err, doc) {
		// 	if (err || !doc)
		// 		res.send(false);
		// 	else
		// 		res.send(doc);
		// });
	},
	is_owner: function(id, res, req) {
		res.send(id != '' && id == req.session.user_id);
	},
	get_album: function(req, res) {
		var sql = "SELECT * FROM photo WHERE user_id = ?;";

		console.log('Get Album!');
		console.log(req.body);
		db.query(sql, req.body['user_id'], function(err, rows) {
			if (err || rows.length < 1) {
				res.send({
					success: false,
					error: err
				});
			}
			else {
				res.send({
					success: true,
					album: rows
				});
			}
		});
		// Photo.find({}).exec(function(err, docs) {
		// 	console.log('Docs are ');
		// 	console.log(docs);
		// 	console.log('Error is ');
		// 	console.log(err);
		// 	if (err || !docs) {
		// 		res.send({
		// 			success: false,
		// 			err: err
		// 		});
		// 		return ;
		// 	}
		// 	else {
		// 		res.send({
		// 			success: true,
		// 			images: docs
		// 		});
		// 	}
		// });
	},
	add_comment: function(req, res) {
		if (!req.session.user_id) {
			res.send({
				success: false,
				error: 'No logged user'
			});
			return ;
		}
		var sql = "INSERT INTO comments SET ?;";
		var comment = {
			author: req.session.user_id,
			photo: req.query.photo_id,
			text: req.query.text
		};

		db.query(sql, comment, function(err) {
			if (err) {
				res.send({
					success: false,
					error: err
				});
			}
			else
				res.send({success: true});
		});
		// comment.save().then(function(rec) {
		// 	res.send({success: true});
		// 	return ;
		// }).catch(function(err) {
		// 	res.send({
		// 		success: false,
		// 		error: err
		// 	});
		// });
	},
	get_comments: function(req, res) {
		var sql = "SELECT * FROM comments WHERE photo = ?;";

		db.query(sql, req.query.photo_id, function(err, rows) {
			if (err || rows.length < 1) {
				res.send({
					success: false,
					error: err
				});
			}
			else {
				res.send({
					success: true,
					data: rows
				});
			}
		});
		// Comment.find({photo: req.query.photo_id}, function(err, docs) {
		// 	if (err || !docs) {
		// 		res.send({
		// 			success: false,
		// 			error: err
		// 		});
		// 		return ;
		// 	}
		// 	res.send({
		// 		success: true,
		// 		data: docs
		// 	});
		// });
	},
	get_users: function(req, res) {
		// console.log('AUTHORS ARE: ');
		// console.log(req.body['authors[]']);
		// console.log(req.body['authors[]'].length);
		var list = Array.isArray(req.body['authors[]']) ? req.body['authors[]'].join("', '") : req.body['authors[]'];
		var sql = "SELECT * FROM users WHERE id IN ('" + list + "');";

		db.query(sql, function(err, rows) {
			if (err || rows.length < 1) {
				res.send({
					success: false,
					error: err ? err : 'Authors aren\'t found' 
				});
			}
			else {
				res.send({
					success: true,
					data: rows
				});
			}
		});
		// User.find({_id: { $in: req.body['authors[]']}}, function(err, docs) {
		// 	if (err || !docs || docs.length < 1) {
		// 		res.send({
		// 			success: false,
		// 			error: err
		// 		});
		// 		return ;
		// 	}
		// 	res.send({
		// 		success: true,
		// 		data: docs
		// 	});
		// });
	},
	set_avatar: function(req, res) {
		var sql = "UPDATE photo SET avatar = 1 WHERE id = ?;";

		db.query(sql, req.query['photo_id'], function(err) {
			sql = "UPDATE photo SET avatar = 0 WHERE id <> ? AND user_id = ?;";
			db.query(sql, [req.query['photo_id'], req.query['user_id']], function(error) {
				if (err || error) {
					res.send({
						success: false,
						error: err ? err : error
					});
				}
				else
					res.send({success: true});
			});
		});
		// User.findById(req.query['user_id'], function(err, doc) {
		// 	if (!doc || err) {
		// 		res.send({
		// 			success: false,
		// 			error: err ? err : 'User is not found', 
		// 		});
		// 		return ;
		// 	}
		// 	for (var i = 0; i < doc.photo.length; i++) {
		// 		if (doc.photo[i]._id == req.query['photo_id'])
		// 			doc.photo[i].avatar = true;
		// 		else
		// 			doc.photo[i].avatar = false;
		// 	}
		// 	doc.markModified('photo');
		// 	doc.save().then(function(doc) {
		// 		res.send({success: true});
		// 		return ;	
		// 	}).catch(function(err) {
		// 		res.send({succes: false, error: err});
		// 	});
		// });
	},
	get_avatar: function(req, res) {
		var sql = "SELECT url FROM photo WHERE user_id = ? AND avatar = 1;";

		db.query(sql, req.query['user_id'], function(err, rows) {
			if (err || rows.length < 1)
				res.send({success: false});
			else {
				res.send({
					success: true,
					data: rows[0].url
				});
			}
		});
	},
	get_avatars: function(req, res) {
		var sql = "SELECT user_id, url FROM photo WHERE avatar = 1 AND user_id IN ('" + req.body['list[]'].join("', '") + "');";

		db.query(sql, function(err, rows) {
			if (err)
				res.send({success: false, error: err});
			else
				res.send({success: true, data: rows});
		});
	},
	like_photo: function(req, res) {
		if (!req.session.user_id || req.session.user_id == '') {
			res.send({success: false, error: 'No logged user'});
			return ;
		}
		var sql = "DELETE FROM likes WHERE photo_id = ? AND author = ?;";
		db.query(sql, [req.query['photo_id'], req.session.user_id], function(err, result) {
			if (err) {
				res.send({
					success: false,
					error: err
				});
			}
			else if (result.affectedRows > 0)
				res.send({success: true});
			else {
				var sql = "INSERT INTO likes SET ?;";
				var like = {
					photo_id: req.query['photo_id'],
					author: req.session.user_id
				}
				db.query(sql, like, function(err) {
					if (err) {
						res.send({
							success: false,
							error: err
						});
					}
					else
						res.send({success: true});
				});
			}
		});
		// Like.deleteMany({author: req.session.user_id, photo_id: req.query['photo_id']}, function(err, result) {
		// 	if (err)
		// 		res.send({success: false, error: err});
		// 	else if (result.n > 0)
		// 		res.send({success: true, res: result});
		// 	else {
		// 		var like = new Like({author: req.session.user_id, owner: req.query['user_id'], photo_id: req.query['photo_id']});
		// 		like.save().then(function(rec) {
		// 			res.send({success: true, res: result});
		// 			return ;
		// 		}).catch(function(err) {
		// 			res.send({success: false, error: err});
		// 		});
		// 	}
		// 	return ;
		// }).catch(function(err) {
		// 	res.send({success: false, error: err});
		// });
	},
	get_likes: function(req, res) {
		var sql = "SELECT * FROM likes WHERE photo_id = ?;";

		db.query(sql, req.query['photo_id'], function(err, rows) {
			if (err) {
				res.send({
					success: false,
					error: err
				});
			}
			else {
				var liked = false;

				for (var i = 0; i < rows.length; i++) {
					if (rows[i].author === req.session.user_id) {
						liked = true;
						break ;
					}
				}
				res.send({
					success: true,
					qty: rows.length,
					liked: liked
				});
			}
		});
		// Like.find({photo_id: req.query['photo_id']}, function(err, docs) {
		// 	if (err) {
		// 		res.send({success: false, error: err});
		// 		return ;
		// 	}
		// 	var liked = false;
		// 	for (var i = 0; i < docs.length; i++) {
		// 		console.log('I = ' + i + ' Author is: ' + docs[i].author + ' Logged user is: ' + req.session.user_id);
		// 		if (docs[i].author == req.session.user_id && (liked = true))
		// 			break ;
		// 	}
		// 	res.send({success: true, qty: docs.length, liked: liked});
		// })
	},
	del_photo: function(req, res) {
		var sql = "SELECT url FROM photo WHERE id = ?;";

		db.query(sql, req.body['photo_id'], function(err, rows) {
			if (err || rows.length < 1) {
				res.send({success: false, error: err ? err : 'Photo is not found'});
				return ;
			}
			fs.unlink('./public' + rows[0].url, function(err) {
				if (err) {
					res.send({success: false, err: err});
					return ;
				}
				sql = "DELETE FROM comments WHERE photo = ?;";
				db.query(sql, req.body['photo_id'], function(err) {
					if (err) {
						res.send({success: false, error: err});
						return ;
					}
					sql = "DELETE FROM likes WHERE photo_id = ?;";
					db.query(sql, req.body['photo_id'], function(err) {
						if (err) {
							res.send({success: false, error: err});
							return ;
						}
						sql = "DELETE FROM photo WHERE id = ?;";
						db.query(sql, req.body['photo_id'], function(err) {
							if (err)
								res.send({success: false, error: err});
							else
								res.send({success: true});
						});
					});
				});
			});
		});
	// 	User.findById(req.session.user_id, function(err, doc) {
	// 		if (err || !doc) {
	// 			res.send({
	// 				success: false, 
	// 				error: err ? err : 'User is not found'
	// 			});
	// 			return ;
	// 		}
	// 		var i = -1;
	// 		while (++i < doc.photo.length) {
	// 			if (doc.photo[i]._id == req.body['photo_id'])
	// 				break ;
	// 		}
	// 		if (i == doc.photo.length || doc.photo.length == 0) {
	// 			res.send({success: false, error: 'Photo is not found'});
	// 			return ;
	// 		}
	// 		fs.unlink('./public' + doc.photo[i].url, function(err) {
	// 			if (err) {
	// 				res.send({success: false, err: 'Cannot delete the file'});
	// 				return ;
	// 			}
	// 		});
	// 		doc.photo.splice(i, 1);
	// 		doc.markModified('photo');
	// 		doc.save().then(function(doc) {
	// 			Comment.remove({photo: req.body['photo_id']}, function(err) {
	// 				if (err) {
	// 					res.send({success: false, error: err});
	// 					return ;
	// 				}
	// 				Like.remove({photo_id: req.body['photo_id']}, function(err) {
	// 					if (err) {
	// 						res.send({success: false, error: err});
	// 						return ;
	// 					}
	// 					res.send({success: true});
	// 				});
	// 			});
	// 		}).catch(function(err) {
	// 			res.send({success: false, error: err});
	// 		});
	// 	});
	},
	find_users: function(req, res) {
		var sql = "SELECT u.id, u.login, u.first_name, u.last_name, u.age, u.about, p.url FROM users u\
			LEFT JOIN photo p ON p.user_id = u.id AND p.avatar = '1'\
				WHERE u.id <> ?";

		db.query(sql, req.query['user_id'], function(err, rows) {
			if (err || !rows || rows.length < 1) {
				res.send({
					success: false,
					error: err ? err : 'No users found'
				});
			}
			else {
				res.send({
					success: true,
					data: rows
				});
			}
		});
	},
	add_friend: function(req, res) {
		var sql = "SELECT * FROM friends WHERE (id1 = ? AND id2 = ?) OR (id1 = ? AND id2 = ?);";
		db.query(sql, [req.session.user_id, req.query['user_id'], req.query['user_id'], req.session.user_id], function(err, rows) {
			if (err || rows.length > 0) {
				res.send({
					success: false,
					error: err ? err.sqlMessage : 'Your friendship is waiting for approval'
				});
				return ;
			}
			else {
				sql = "INSERT INTO friends SET ?";
				db.query(sql, {id1: req.session.user_id, id2: req.query['user_id']}, function(err) {
					if (err)
						res.send({success: false, error: err});
					else
						res.send({success: true, text: 'Request has been sent'});
				});
			}
		});
	},
	del_friend: function(req, res) {
		var sql = "DELETE FROM friends WHERE (id1 = ? AND id2 = ?) OR (id1 = ? AND id2 = ?);";

		db.query(sql, [req.session.user_id, req.query['user_id'], req.query['user_id'], req.session.user_id], function(err) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true, text: 'User has been removed from your friend list'});
		});
	},
	is_friend: function(req, res) {
		var sql = "SELECT * FROM friends WHERE ((id1 = ? AND id2 = ?) OR (id1 = ? AND id2 = ?)) AND active = '1';";

		db.query(sql, [req.session.user_id, req.query['user_id'], req.query['user_id'], req.session.user_id], function(err, rows) {
			if (err || !rows || rows.length == 0)
				res.send(false);
			else
				res.send(true);
		});
	},
	get_requests: function(req, res) {
		var sql = "SELECT u.id, u.login, p.url AS avatar FROM friends f\
			INNER JOIN users u ON u.id = f.id1\
				LEFT JOIN photo p ON p.user_id = f.id1 AND p.avatar = '1'\
					WHERE f.id2 = ? AND f.active = '0';";
		db.query(sql, req.session.user_id, function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true, data: rows});
		});
	},
	confirm_friend: function(req, res) {
		console.log(req.query['action']);
		if (req.query['action'] == 'confirm_friend')
			var sql = "UPDATE friends SET active = '1' WHERE id1 = ? AND id2 = ?;";
		else
			var sql = "DELETE FROM friends WHERE id1 = ? AND id2 = ?;";

		db.query(sql, [req.query['user_id'], req.session.user_id], function(err) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true});
		});
	},
	get_friends: function(req, res) {
		var sql = "SELECT u.id, u.login, u.first_name, u.last_name, u.age, u.about, p.url AS avatar \
			FROM users u\
				INNER JOIN friends f ON (f.id1 = u.id OR f.id2 = u.id)\
					LEFT JOIN photo p ON u.id = p.user_id AND p.avatar = '1'\
						WHERE u.id <> ? AND f.active = '1' AND (f.id1 = ? OR f.id2 = ?);";
		db.query(sql, [req.session.user_id, req.session.user_id, req.session.user_id], function(err, rows) {
			console.log(this.sql);
			if (err)
				res.send({success: false, err: err.sqlMessage});
			else
				res.send({success: true, data: rows});
		});
	},
	get_messages: function(req, res) {
		var sql = "SELECT m.*, u.login FROM messages m\
					INNER JOIN users u ON u.id = m.author\
						WHERE (m.author = ? AND m.dest_user = ?) OR (m.author = ? AND m.dest_user = ?)\
							ORDER BY m.time;";
		db.query(sql, [req.body['user_id'], req.session.user_id, req.session.user_id, req.body['user_id']], function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true, data: rows});
		});
	},
	send_message: function(req, res) {
		var sql = "INSERT INTO messages SET ?;";

		db.query(sql, {
			author: req.session.user_id,
			dest_user: req.body['user_id'],
			text: req.body['text'].trim()
		}, function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true});
		});
	}
}

// var new_user = {
// 				login: data['login'],
// 				password: hash.generate(data['password'], {algorithm: 'sha256'}),
// 				email: data['email']
// 			}
// 			if (data['login'] === 'root')
// 				new_user['admin'] = true;
// 			user = new User(new_user);
// 			user.save().then(function(record){
// 				req.session.user_id = record.id;
// 				req.session.user_login = record.login;
// 				res.render('./auth/valid', {
// 					registred: true,
// 					login: new_user['login']
// 				});
// 			}, function(err) {
// 				console	.log('test   ' + err);
// 				res.render('./auth/valid', {
// 					registred: false,
// 					error: err
// 				});
// 			});
