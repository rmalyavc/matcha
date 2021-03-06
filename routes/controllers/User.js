var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test', { useNewUrlParser: true });
var user_validator = require('../validators/User.js');
var hash = require('password-hash');
var fs = require('fs');
var shell = require('shelljs');
var multer  = require('multer');
var db = require('../config/connection.js');
var matches = require('../config/matches.js');

var nodemailer = require('nodemailer');
var md5 = require('md5');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fattest89@gmail.com',
        pass: 'Stanly106601'
    }
});

function is_email(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function is_hashtag(tag) {
	var re = /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/;
	var restricted = [",", "'", '"', '`', '~', '^', '/', "\\", '{', '}', '[', ']', '(', ')', ' ', "\t", "\n", "\r", "*", "|", "%", "$", "=", "+", "@", "1", "<", ">", ";", ":", ".", "§", "±", "№"];
	if (!re.test(String(tag).toLowerCase()) || tag.lastIndexOf("#") != 0)
		return (false);
	for (var i = 0; i < restricted.length; i++) {
		if (tag.lastIndexOf(restricted[i]) != -1)
			return (false);
	}
	return (true);
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
				admin: data['login'] === 'root' ? true : false,
				first_name: data['first_name'],
				last_name: data['last_name'],
			}
			db.query(sql, new_user, function(err, results) {
				if (err) {
					res.render('./auth/valid', {
						registred: false,
						error: 'DB Error'
					});
					return ;
				}
				sql = "INSERT INTO locations SET ?";
				db.query(sql, {
					user_id: results.insertId,
					latitude: data['latitude'],
					longitude: data['longitude'],
					approved: data['approved'],
					city: data['city']
				}, function(err) {
					if (err) {
						res.render('./auth/valid', {
							registred: false,
							error: 'DB Error'
						});
					}
					else {
						var link_hash = md5(new Date());
						var body = '<h3>Hey ' + data['login'] + '!</h3>\
									<span>Please activate your account by clicking&nbsp;</span><a href="http://localhost:3000/users/activate?link=' + link_hash + '">here</a>';
						var mailOptions = {
				            from: 'fattest89@gmail.com',
				            to: data['email'],
				            subject: 'Activate your account on Matcha web site',
				            html: body,
				        };
				        transporter.sendMail(mailOptions, function(error, info){
				            if (error) {
				                res.render('./auth/valid', {
									registred: false,
									error: error
								});
				            }
				            else {
				            	sql = "INSERT INTO links SET ?";
				            	db.query(sql, {
				            		user_id: results.insertId,
				            		hash: link_hash
				            	}, function(err) {
				            		if (err) {
				            			res.render('./auth/valid', {
											registred: false,
											error: err.sqlMessage
										});
				            		}
				            		else {
				            			res.render('./auth/valid', {
											registred: true,
											login: new_user['login']
										});
				            		}
				            	});
				            }
				        });
					}	
				});
			});
		}
	},
	login: function(req, res) {
		var sql = "SELECT id, login, password, active FROM users WHERE login = ? OR email = ?;";

		db.query(sql, [req.body.login, req.body.login], function(err, result) {
			if (err)
				res.redirect('/users/login?error=' + err.sqlMessage);
			else {
				if (result.length == 0) {
					res.redirect('/users/login?error=Invalid login or email');
					return ;
				}
				else if (result[0].active == '0') {
					res.redirect('/users/login?error=You need to activate your account with link from your email');
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
			if (err)
				res.redirect('/error?error=' + err.sqlMessage);
			else {
				if (data['latitude'] && data['longitude'] && data['city']) {
					sql = "UPDATE locations SET ? WHERE user_id = ?";
					db.query(sql, [
						{
							latitude: data['latitude'],
							longitude: data['longitude'],
							city: data['city']
						}, data['user_id']], function(err) {
							if (err)
								res.redirect('/error?error=' + err.sqlMessage);
							else
								res.redirect(url);
						}
					);
				}
				else
					res.redirect(url);
			}
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
				error: 'Only JPEG, PNG or GIF files are allowed'
			});
			return ;
		}
		else {
			var sql = "SELECT COUNT(id) AS qty FROM photo WHERE user_id = ?";

			db.query(sql, req.session.user_id, function(err, rows) {
				if (err || rows[0]['qty'] > 4)
					res.send({success: false, error: err ? err.sqlMessage : 'You cannot upload more then 5 photos'});
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
								error: err.sqlMessage
							});
						}
						else
							res.send({success: true});
					});
				}
			});
		}
	},
	is_unique: function(req, res) {
		if (!req.query.login && !req.query.email) {
			res.send(false);
			return ;
		}
		var login = req.query.login ? req.query.login : req.query.email;
		var sql = "SELECT id FROM users WHERE (login = ? OR email = ?)";
		var args = [login, login];
		if (req.session.user_id) {
			sql += " AND id <> ?";
			args.push(req.session.user_id);
		}
		db.query(sql, args, function(err, rows) {
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
		var sql = "SELECT u.*, l.*\
					FROM users u\
					LEFT JOIN locations l ON l.user_id = u.id\
					WHERE u.id = ?";
		db.query(sql, req.session.user_id, function(err, rows) {
			if (err || !rows || rows.length < 1) {
				res.send({success: false, error: err ? err.sqlMessage : 'DB error'});
				return ;
			}
			var where = '';
			var user = rows[0];
			if (!user.gender)
				user.gender = 'Other';
			if (!user.orientation)
				user.orientation = 'Other';
			if (!user.age)
				user.age = 0;
			if (!user.latitude)
				user.latitude = 0;
			if (!user.longitude)
				user.longitude = 0;
			if (req.query.params && req.query.params != {}) {
				var params = req.query.params;
				var keys = Object.keys(params);
				for (var i = 0; i < keys.length; i++) {
					var param = params[keys[i]];
					if (keys[i] == 'gender' || keys[i] == 'orientation') {
						for (var j = 0; j < params[keys[i]].length; j++) {
							if (j == 0)
								where += " AND (u." + keys[i] + " = '" + params[keys[i]][j] + "'";
							else
								where += " OR u." + keys[i] + " = '" + params[keys[i]][j] + "'";
							if (j == params[keys[i]].length - 1)
								where += ")";
						}
					}
					else if (keys[i] == 'age') {
						var age_keys = Object.keys(params[keys[i]]);
						for (var j = 0; j < age_keys.length; j++) {
							if (age_keys[j] == 'from')
								where += " AND u.age >= '" + params[keys[i]]['from'] + "'";
							else if (age_keys[j] == 'to')
								where += " AND u.age <= '" + params[keys[i]]['to'] + "'";
						}
					}
					else if (keys[i] == 'hashtag')
						where += " AND h.name LIKE '%" + param + "%'";
				}
			}
			var from = req.query['from'] ? parseInt(req.query['from']) : 0;
			sql = "SELECT u.id, u.login, u.first_name, u.last_name, u.age, u.rating, u.gender, u.orientation, u.about, p.url AS avatar, GROUP_CONCAT(h.name) AS hashtags, l.latitude, l.longitude,\
						(SELECT COUNT(*) FROM `hashtags` WHERE user_id <> ? AND name IN (SELECT DISTINCT name FROM hashtags WHERE user_id = ?) AND user_id = u.id) AS common_tags\
					FROM users u\
					LEFT JOIN photo p ON p.user_id = u.id AND p.avatar = '1'\
					LEFT JOIN locations l ON l.user_id = u.id\
					LEFT JOIN hashtags h ON h.user_id = u.id\
					WHERE u.id <> ?\
					AND u.id NOT IN(SELECT blocked\
									FROM black_list\
									WHERE blocker = ?)\
					AND u.active = '1'" + where + "\
					GROUP BY u.id, p.url\
					ORDER BY\
						CASE\
					    	WHEN u.gender = 'Male' THEN ?\
					    	WHEN u.gender = 'Female' THEN ?\
					        WHEN u.gender = 'Other' THEN ?\
					        ELSE 42\
					    END,\
					    CASE\
					    	WHEN u.orientation = 'Heterosexual' THEN ?\
					        WHEN u.orientation = 'Bisexual' THEN ?\
					        WHEN u.orientation = 'Homosexual' THEN ?\
					        WHEN u.orientation = 'Asexual' THEN ?\
					        WHEN u.orientation = 'Other' THEN ?\
					        ELSE 42\
					    END,\
					    CASE\
					    	WHEN u.age IS NOT NULL THEN ABS (? - CAST(u.age AS SIGNED))\
					    	ELSE 42000\
					    END,\
					    CASE\
					    	WHEN l.latitude IS NOT NULL THEN 111.111 *\
											    	DEGREES(ACOS(LEAST(COS(RADIANS(l.latitude))\
													* COS(RADIANS(?))\
													* COS(RADIANS(l.longitude - ?))\
													+ SIN(RADIANS(l.latitude))\
													* SIN(RADIANS(?)), 1.0)))\
					        ELSE 42\
					    END,\
					    common_tags DESC\
					    LIMIT " + from + ", 10";
			db.query(sql, [
				req.session.user_id,
				req.session.user_id,
				req.session.user_id,
				req.session.user_id,
				matches[user.gender][user.orientation]['gender']['Male'],
				matches[user.gender][user.orientation]['gender']['Female'],
				matches[user.gender][user.orientation]['gender']['Other'],
				matches[user.gender][user.orientation]['orientation']['Heterosexual'],
				matches[user.gender][user.orientation]['orientation']['Bisexual'],
				matches[user.gender][user.orientation]['orientation']['Homosexual'],
				matches[user.gender][user.orientation]['orientation']['Asexual'],
				matches[user.gender][user.orientation]['orientation']['Other'],
				user.age,
				user.latitude,
				user.longitude,
				user.latitude
			], function(err, rows) {
				if (err || !rows) {
					res.send({
						success: false,
						error: err ? err : 'DB error'
					});
				}
				else {
					res.send({
						success: true,
						data: rows
					});
				}
			});
		});
	},
	auto_complete: function(req, res) {
		if (req.query['find_from'] == 'hashtag') {
			var sql = "SELECT DISTINCT name\
						FROM hashtags\
						WHERE name LIKE ?";
			var needle = "%" + req.query['to_find'] + "%";
			db.query(sql, needle, function(err, rows) {
				if (err || !rows)
					res.send({success: false, error: err ? err.sqlMessage : 'DB error'});
				else
					res.send({success: true, data: rows});
			});
		}
		else
			res.send({success: false, error: 'Unable to find ' + req.query['to_find']});
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
				sql = "SELECT DISTINCT user_id FROM photo WHERE user_id = ?";
				db.query(sql, [req.session.user_id], function(err, rows) {
					if (err || rows.length < 1)
						res.send({success: false, error: err ? err.sqlMessage : 'You must have at least one photo to send this request'});
					else {
						sql = "INSERT INTO friends SET ?";
						db.query(sql, {id1: req.session.user_id, id2: req.query['user_id']}, function(err) {
							if (err)
								res.send({success: false, error: err.sqlMessage});
							else
								res.send({success: true, text: 'Request has been sent'});
						});
					}
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
				sql = "INSERT INTO tmp_cont (id)\
	                SELECT r.id FROM rooms r\
	                INNER JOIN room_user ru ON ru.room_id = r.id\
	                WHERE r.active = '1'\
	                AND r.private = '1'\
	                AND ru.user_id = ?\
	                AND ru.room_id IN (\
	                	SELECT rs.id\
                        FROM rooms rs\
                        INNER JOIN room_user rur ON rur.room_id = rs.id\
                        WHERE rs.private = '1' AND rs.active = '1'\
                        AND rur.user_id = ?);\
                    UPDATE rooms SET active = '0' WHERE id IN (\
                    	SELECT id FROM tmp_cont);\
                    DELETE FROM room_user WHERE room_id IN (\
                    	SELECT id FROM tmp_cont);\
                    DELETE FROM tmp_cont;";
                db.query(sql, [req.session.user_id, req.query['user_id']], function(err) {
                	if (err)
                		res.send({success: false, error: err.sqlMessage});
                	else
                		res.send({success: true, text: 'User has been removed from your friend list'});
                });
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
			if (err)
				res.send({success: false, err: err.sqlMessage});
			else
				res.send({success: true, data: rows});
		});
	},
	get_chats: function(req, res) {
		var sql = "SELECT r.id, GROUP_CONCAT(p.url) AS avatar, GROUP_CONCAT(u.login) AS login FROM room_user ru\
			INNER JOIN rooms r ON r.id = ru.room_id AND r.active = '1'\
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
		var sql = "SELECT m.*, u.login, p.url AS avatar\
			FROM messages m\
				INNER JOIN users u ON u.id = m.author\
					LEFT JOIN photo p ON p.user_id = m.author AND p.avatar = '1'\
						WHERE m.room_id = ?\
							ORDER BY m.time";
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
	},
	add_hashtag: function(req, res) {
		var sql = "INSERT INTO hashtags SET ?";

		if (!is_hashtag(req.query['text'])) {
			res.send({success: false, error: 'Not a valid hashtag'});
			return ;
		}
		db.query(sql, {user_id: req.session.user_id, name: req.query['text'].trim()}, function(err) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true});
		});
	},
	get_tags: function(req, res) {
		var sql = "SELECT id, name FROM hashtags WHERE user_id = ?";
		db.query(sql, req.query['user_id'], function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else if (!rows || rows.length < 1)
				res.send({success: false, error: 'No hashtags found'});
			else
				res.send({success: true, data: rows, is_owner: req.query['user_id'] == req.session.user_id});
		});
	},
	del_hashtag: function(req, res) {
		var sql = "DELETE FROM hashtags WHERE id = ? AND user_id = ?";
		db.query(sql, [req.body['tag_id'], req.session.user_id], function(err, result) {
			if (res.error)
				res.send({success: false, error: err.sqlMessage});
			else if (!result || result.affectedRows < 1)
				res.send({success: false, error: 'Hashtag is not found'});
			else
				res.send({success: true});
		});
	},
	copy_hashtag: function(req, res) {
		var sql = "SELECT id FROM hashtags WHERE name = ? AND user_id = ?";
		db.query(sql, [req.query['tag_name'].trim(), req.session.user_id], function(err, rows) {
			if (err || !rows)
				res.send({success: false, error: 'DB Error'});
			else if (rows.length > 0)
				res.send({success: false, error: 'You already have such tag'});
			else if (is_hashtag(req.query['tag_name'].trim())){
				sql = "INSERT INTO hashtags SET ?";
				db.query(sql, {name: req.query['tag_name'].trim(), user_id: req.session.user_id}, function(err) {
					if (err)
						res.send({success: false, error: 'DB Error'});
					else
						res.send({success: true, text: 'Tag has been copied'});
				});
			}
			else
				res.send({success: false, error: 'Unknown Error'});
		});
	},
	update_unread_messages: function(req, res) {
		var sql = "INSERT INTO message_user (message_id, user_id)\
					SELECT m.id, ?\
					FROM messages m\
					WHERE room_id = ?\
					AND id NOT IN (\
								SELECT mu.message_id FROM message_user mu\
								WHERE mu.user_id = ? AND mu.message_id = m.id\
					)";
		db.query(sql, [req.session.user_id, req.body['room_id'], req.session.user_id], function(err) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true});
		});
	},
	get_unread_messages: function(req, res) {
		var sql = "SELECT u.id AS user_id, u.login, p.url AS avatar, m.room_id, COUNT(m.id) AS total\
					FROM users u\
					INNER JOIN messages m ON m.author = u.id\
					INNER JOIN room_user ru ON ru.room_id = m.room_id AND ru.user_id = ?\
					LEFT JOIN photo p ON p.user_id = u.id AND p.avatar = 1\
					WHERE m.author <> ?\
					AND m.id NOT IN (\
								SELECT mu.message_id\
								FROM message_user mu\
								WHERE mu.user_id = ?\
								AND mu.message_id = m.id)\
                    GROUP BY u.id, m.room_id, p.url";
        db.query(sql, [req.session.user_id, req.session.user_id, req.session.user_id], function(err, rows) {
        	if (err)
        		res.send({success: false, error: err.sqlMessage});
        	else
        		res.send({success: true, data: rows});
        });
	},
	update_rating: function(req, res) {
		var sql = "UPDATE users SET rating = rating + ? WHERE id = ?";

		db.query(sql, [parseInt(req.body['points']), req.body['user_id']], function(err) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true});
		});
	},
	block_user: function(req, res) {
		var sql = "INSERT INTO black_list SET ?";

		db.query(sql, {blocker: req.session.user_id, blocked: req.body['user_id']}, function(err) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true});
		});
	},
	is_blocked: function(req, res) {
		var sql = "SELECT blocker, blocked FROM black_list WHERE (blocker = ? AND blocked = ?) OR (blocker = ? AND blocked = ?) LIMIT 1";

		db.query(sql, [req.session.user_id, req.query['user_id'], req.query['user_id'], req.session.user_id], function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else {
				var blocked = rows && rows.length > 0;
				var response = '';

				if (blocked)
					response = rows[0]['blocker'] == req.session.user_id ? 'You blocked this user' : 'This user blocked you';
				res.send({success: true, blocked: blocked, response: response});
			}
		});
	},
	get_history: function(req, res) {
		var sql = "SELECT h.id, h.visitor, h.type, h.confirm, h.time, u.login, p.url AS avatar\
					FROM history h\
					INNER JOIN users u ON u.id = h.visitor\
					LEFT JOIN photo p ON p.user_id = h.visitor AND p.avatar = 1\
					WHERE h.owner = ?\
					AND h.reviewed = 0\
					AND h.visitor NOT IN(\
										SELECT blocked\
										FROM black_list\
										WHERE blocker = ?\
										)\
					ORDER BY h.time DESC";

		db.query(sql, [req.session.user_id, req.session.user_id], function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true, data: rows});
		});
	},
	insert_history: function(req, res) {
		var sql = "INSERT INTO history SET ?";

		db.query(sql, {
			owner: req.body['owner'],
			visitor: req.session.user_id,
			type: req.body['type'],
			confirm: req.body['confirm'],
		}, function(err) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true});
		});
	},
	read_history: function(req, res) {
		var sql = "UPDATE history SET reviewed = 1 WHERE owner = ?";

		db.query(sql, req.session.user_id, function(err) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true});
		});
	},
	get_rating: function(req, res) {
		var sql = "SELECT rating FROM users WHERE id = ?";

		db.query(sql, req.query['user_id'], function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else if (!rows || rows.length < 1 || rows[0].rating === null)
				res.send({success: false, error: 'No such user'});
			else
				res.send({success: true, data: rows[0].rating});
		});
	},
	get_visits: function(req, res) {
		if (req.query['button_id'] == 'by_you') {
			var sql = "SELECT h.owner AS id, u.login, p.url AS avatar, h.time\
					FROM history h\
					INNER JOIN users u ON u.id = h.owner\
					LEFT JOIN photo p ON p.user_id = h.owner AND p.avatar = '1'\
					WHERE h.visitor = ?\
					AND h.type = 'visit'\
					ORDER BY h.time DESC";
		}
		else if (req.query['button_id'] == 'by_other') {
			var sql = "SELECT h.visitor AS id, u.login, p.url AS avatar, h.time\
					FROM history h\
					INNER JOIN users u ON u.id = h.visitor\
					LEFT JOIN photo p ON p.user_id = h.visitor AND p.avatar = '1'\
					WHERE h.owner = ?\
					AND h.type = 'visit'\
					ORDER BY h.time DESC";
		}
		else {
			res.send({success: false, error: 'Invalid param \"button_id\" = ' + req.query['button_id']});
			return ;
		}
		db.query(sql, req.session.user_id, function(err, rows) {
			if (err)
				res.send({success: false, error: err.sqlMessage});
			else
				res.send({success: true, data: rows});
		});
	},
	send_restore_link: function(req, res) {
		var link_hash = md5(new Date());
		var sql = "SELECT id, login FROM users WHERE email = ?";

		db.query(sql, req.body['email'], function(err, rows) {
			if (err || !rows)
				res.render('auth/restore', {error: 'DB error'});
			else if (rows.length < 1)
				res.render('auth/restore', {error: 'User with such email is not found'});
			else {
				sql = "INSERT INTO links SET ?";

				db.query(sql, {
					user_id: rows[0]['id'],
					hash: link_hash
				}, function(err) {
					if (err)
						res.render('auth/restore', {error: 'DB error'});
					else {
						var body = '<h3>Hey ' + rows[0]['login'] + '!</h3>\
									<span>Please restore your password by clicking&nbsp;</span><a href="http://localhost:3000/users/forgot?link=' + link_hash + '&user_id=' + rows[0]['id'] + '">here</a>';
						var mailOptions = {
				            from: 'Matcha',
				            to: req.body['email'],
				            subject: 'Matcha Restore Link',
				            html: body,
				        };
				        
						transporter.sendMail(mailOptions, function(error, info) {
							if (error)
								res.render('auth/restore', {error: error});
							else
								res.render('auth/restore', {send_result: true});
						});
					}
				});
			}
		});
	},
	validate_restore_link: function(req, res) {
		var sql = "SELECT * FROM links WHERE hash = ? AND user_id = ?";

		db.query(sql, [req.query['link'], req.query['user_id']], function(err, rows) {
			if (err || !rows)
				res.render('auth/restore', {error: 'DB error'});
			else if (rows.length < 1)
				res.render('auth/restore', {error: 'Invalid link'});
			else {
				sql = "DELETE FROM links WHERE id = ?";

				db.query(sql, rows[0].id, function(err) {
					if (err)
						res.render('auth/restore', {error: 'DB error'});
					else
						res.render('auth/restore', {email: true, user_id: req.query['user_id']});
				});
			}
		});
	},
	change_password: function(req, res) {
		var sql = "UPDATE users SET password = ? WHERE id = ?";
		db.query(sql, [hash.generate(req.body['password'], {algorithm: 'sha256'}), req.body['user_id']], function(err, result) {
			if (err || !result)
				res.render('auth/restore', {error: 'DB error'});
			else if (result.affectedRows < 1)
				res.render('auth/restore', {error: 'User is not found'});
			else {
				sql = "SELECT login FROM users WHERE id = ?";

				db.query(sql, req.body['user_id'], function(err, rows) {
					if (err || !rows)
						res.render('auth/restore', {error: 'DB error'});
					else if (rows.length < 1)
						res.render('auth/restore', {error: 'User is not found'});
					else {
						req.session.user_id = req.body['user_id'];
						req.session.user_login = rows[0].login;
						res.redirect('/');
					}
				});
			}
		});
	},
	fake_account: function(req, res) {
		var sql = "SELECT id FROM fake_reports WHERE reporter = ? AND reported = ?";

		db.query(sql, [req.session.user_id, req.body['user_id']], function(err, rows) {
			if (err) {
				res.send({success: false, error: 'DB error'});
			}
			else if (rows.length > 0)
				res.send({success: false, error: 'You already reported this user'});
			else {
				sql = "INSERT INTO fake_reports SET ?";

				db.query(sql, {reporter: req.session.user_id, reported: req.body['user_id']}, function(err) {
					if (err) {
						res.send({success: false, error: 'DB error'});
					}
					else
						res.send({success: true});
				});
			}
		});
	},
	check_fake: function(req, res) {
		var sql = "SELECT id FROM fake_reports WHERE reporter = ? AND reported = ?";

		db.query(sql, [req.session.user_id, req.query['user_id']], function(err, rows) {
			if (err)
				res.send({success: false, error: 'DB error'});
			else
				res.send({success: true, reported: rows.length > 0});
		});
	}
}

