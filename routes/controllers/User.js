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
		}
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
	},
	get_user: function(id, res) {
		var sql = "SELECT * FROM users WHERE id = ?;";

		db.query(sql, [id], function(err, rows) {
			if (err || rows.length < 1)
				res.send(false);
			else
				res.send(rows[0]);
		});
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
	},
	get_users: function(req, res) {
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
			else {
				res.send({success: true, text: 'User has been removed from your friend list'});
			}
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
			else {
				sql = "INSERT INTO rooms (active) VALUES ('1');";
				db.query(sql, function(err, query_res) {
					if (err || !query_res)
						res.send({success: false, error: err.sqlMessage});
					else {
						var room = query_res.insertId;
						sql = "INSERT INTO room_user (room_id, user_id) VALUES (?, ?), (?, ?)";
						db.query(sql, [room, req.session.user_id, room, req.query['user_id']], function(err) {
							if (err)
								res.send({success: false, error: err.sqlMessage});
							else
								res.send({success: true});
						});
					}
				});
			}
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
	get_chats: function(req, res) {
		var sql = "SELECT r.id, GROUP_CONCAT(p.url) AS avatar, GROUP_CONCAT(u.login) AS login FROM room_user ru\
			INNER JOIN rooms r ON r.id = ru.room_id\
				INNER JOIN users u ON u.id = ru.user_id\
					LEFT JOIN photo p ON p.user_id = ru.user_id AND r.private = '1' AND p.avatar = '1'\
						WHERE  ru.user_id <> ?\
							AND ru.room_id IN (SELECT room_id FROM room_user WHERE user_id = ?)\
								GROUP BY r.id";
		db.query(sql, [req.session.user_id, req.session.user_id], function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true, data: rows});
		});
	},
	get_messages: function(req, res) {
		var sql = "SELECT m.*, u.login FROM messages m\
			INNER JOIN users u ON u.id = m.author\
				WHERE m.room_id = ?";
		db.query(sql, req.body['room_id'], function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true, data: rows, });
		});
	},
	send_message: function(req, res) {
		var sql = "INSERT INTO messages SET ?;";

		db.query(sql, {
			author: req.session.user_id,
			text: req.body['text'].trim(),
			room_id: req.body['room_id']
		}, function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true});
		});
	},
	get_room: function(req, res) {
		var sql = "SELECT r.id FROM rooms r\
			INNER JOIN room_user ru ON ru.room_id = r.id\
				WHERE ru.user_id = ?\
					AND r.private = '1'\
						AND r.id IN (\
							SELECT ir.id FROM rooms ir\
								INNER JOIN room_user iru ON iru.room_id = ir.id\
									WHERE iru.user_id = ?\
										AND ir.private = '1');";
		db.query(sql, [req.session.user_id, req.query['user_id']], function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else if (!rows || rows.length < 1)
				res.send({success: false, error: 'Room is not found'});
			else
				res.send({success: true, room_id: rows[0].id});
		});
	},
	current_user: function(req, res) {
		if (!req.session.user_id || req.session.user_id == '')
			res.send({success: false, error: 'No logged user'});
		else {
			var sql = "SELECT u.*, p.url AS avatar\
				FROM users u\
					LEFT JOIN photo p ON p.user_id = u.id AND p.avatar = '1'\
						WHERE u.id = ?";
			db.query(sql, req.session.user_id, function(err, rows) {
				if (err)
					res.send({success: false, error: err.sqlMessage});
				else if (!rows || rows.length < 1)
					res.send({success: false, error: 'There is no such user'});
				else
					res.send({success: true, data: rows[0]});
			});
		}
	},
	invite_list: function(req, res) {
		var sql = "SELECT u.id, u.login, p.url AS avatar\
			FROM users u\
				INNER JOIN friends fr ON (fr.id1 = ? AND fr.id2 = u.id) OR (fr.id1 = u.id AND fr.id2 = ?)\
					LEFT JOIN photo p ON p.user_id = u.id AND p.avatar = '1'\
						WHERE u.id NOT IN (SELECT user_id FROM room_user WHERE room_id = ? AND user_id <> ?)";
		db.query(sql, [req.session.user_id, req.session.user_id, req.query['room_id'], req.session.user_id], function (err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else if (!rows || rows.length < 1)
				res.send({success: false, error: 'No users found to invite'});
			else
				res.send({success: true, data: rows});
		});
	},
	add_to_chat: function(req, res) {
		var sql = "SELECT private FROM rooms WHERE id = ?";
		db.query(sql, req.query['room_id'], function(err, rows) {
			if (err || !rows || rows.length < 1) {
				res.send({
					success: false,
					error: err ? err.sqlMessage : 'No such room ' + req.query['room_id']
				});
				return ;
			}
			// var room = req.query['room_id'];
			if (rows[0]['private'] == '1') {
				sql = "INSERT INTO rooms SET ?";
				db.query(sql, {private: '0'}, function(err, result) {
					if (err) {
						res.send({success: false, error: err.sqlMessage});
						return ;
					}
					var room = result.insertId;					
					sql = "SELECT user_id FROM room_user WHERE room_id = ?";
					db.query(sql, req.query['room_id'], function(err, rows) {
						if (err || !rows || rows.lngth < 1) {
							res.send({
								success: false,
								error: err ? err.sqlMessage : 'No users in room ' + req.query['room_id']
							});
							return ;
						}
						sql = "INSERT INTO room_user (room_id, user_id) VALUES ('" + room + "', '" + req.query['user_id'] + "')";
						for (var i = 0; i < rows.length; i++) {
							sql += ", ('" + room + "', '" + rows[i]['user_id'] + "')";
						}
						db.query(sql, function(err) {
							if (err)
								res.send({success: false, error: err.sqlMessage});
							else
								res.send({success: true, data: room});
						});
					});
				});
			}
			else {
				sql = "INSERT INTO room_user SET ?";
				db.query(sql, {room_id: req.query['room_id'], user_id: req.query['user_id']}, function(err) {
					if (err)
						res.send({success: false, error: err.sqlMessage});
					else
						res.send({success: true, data: req.query['room_id']});
				});
			}
		})
	}
}

