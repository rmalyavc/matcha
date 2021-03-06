var express = require('express');
var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'tmp/' });
var router = express.Router();
var user_controller = require('./controllers/User.js');
var Admin = require('./controllers/Admin.js');
var db = require('./config/connection.js');

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
	else
		res.render('auth/register', {data: req.session.user});
});

router.post('/update', function(req, res, next) {
	user_controller.update(req, res);
});

router.get('/forgot', function(req, res, next) {
	if (!req.query['link'] || req.query['link'] == '' || !req.query['user_id'] || req.query['user_id'] == '')
  		res.render('auth/restore');
  	else
  		user_controller.validate_restore_link(req, res);
});

router.post('/forgot', function(req, res, next) {
	if (req.body['email'] && req.body['email'] != '')
		user_controller.send_restore_link(req, res);
	else if (req.body['password'] && req.body['password_again'] && req.body['password'] != '' && req.body['password_again'] != '' && req.body['password'].trim().length > 7 && req.body['password'] === req.body['password_again'])
		user_controller.change_password(req, res);
	else
		res.render('auth/restore', {error: 'Invalid password'});
});

router.post('/valid', function(req, res, next) {
	if (req.body.page === 'register')
		user_controller.register(req, res);
	else if (req.body.page === 'login')
		user_controller.login(req, res);
	else
		res.redirect('/users/login');
});

router.get('/history', function(req, res, next) {
	if (!req.session.user_id || req.session.user_id == '')
		res.redirect('/users/login');
	else
		res.render('users/history', {
			logged_user: req.session.user_id,
		});
});

router.get('/profile/:id', function(req, res, next) {
	if (!req.session.user_id || req.session.user_id == '') {
		res.redirect('/users/login');
		return ;
	}
	var is_owner = (req.params.id == req.session.user_id);
	var sql = "SELECT u.*, l.city, l.latitude, l.longitude\
				FROM users u\
				LEFT JOIN locations l ON l.user_id = u.id\
				WHERE u.id = ?";

	db.query(sql, req.params.id, function(err, rows) {
		if (err || rows.length < 1)
			res.redirect('/error?error=User is not found');
		else {
			var error = req.query['err'] ? req.query['err'] : false;
			res.render('users/profile', {
				user: rows[0],
				is_owner: is_owner,
				err: error,
				logged_user: req.session.user_id
			});
		}
	});
});

router.get('/friends', function(req, res, next) {
	if (!req.session.user_id)
		res.redirect('/users/login');
	else
		res.render('users/friends', {
			logged_user: req.session.user_id,
			friends: true,
			chat_with: req.query.room_id ? req.query.room_id : false
		});
});

router.get('/activate', function(req, res, next) {
	if (!req.query['link'] || req.query['link'] == '') {
		res.redirect('/error?error=No Link');
		return ;
	}
	var sql = "SELECT l.user_id, u.login\
				FROM links l\
				INNER JOIN users u ON u.id = l.user_id\
				WHERE hash = ?";
	db.query(sql, req.query['link'], function(err, rows) {
		if (err)
			res.redirect('/error?error=DB error');
		else if (!rows || rows.length < 1)
			res.redirect('/error?error=Invalid link');
		else {
			sql = "UPDATE users SET active = '1' WHERE id = ?;\
					DELETE FROM links WHERE hash = ?";
			db.query(sql, [rows[0].user_id, req.query['link']], function(err) {
				if (err)
					res.redirect('/error?error=DB error');
				else {
					req.session.user_id = rows[0].user_id;
					req.session.user_login = rows[0].login;
					res.redirect('/');
				}
			});
		}
	});
});

router.get('/ajax', function(req, res, next) {
	if (req.query['action'] == 'is_unique')
		user_controller.is_unique(req, res);
	else if (req.query['action'] == 'current_user')
		user_controller.current_user(req,res);
	else if (req.query['action'] == 'is_owner' && req.query['id'])
		user_controller.is_owner(req.query['id'], res, req);
	else if (req.query['action'] == 'get_user' && req.query['id'])
		user_controller.get_user(req.query['id'], res);
	else if (req.query['action'] == 'get_all_users')
		Admin.get_all_users(req, res);
	else if (req.query['action'] == 'add_comment' && req.query['photo_id'] && req.query['owner_id'] && req.query['text'])
		user_controller.add_comment(req, res);
	else if (req.query['action'] == 'get_comments' && req.query['photo_id'])
		user_controller.get_comments(req, res);
	else if (req.query['action'] == 'set_avatar' && req.query['photo_id'] && req.query['user_id'] && req.query['user_id'] == req.session.user_id)
		user_controller.set_avatar(req, res);
	else if (req.query['action'] == 'like_photo' && req.query['photo_id'] && req.query['user_id'])
		user_controller.like_photo(req, res);
	else if (req.query['action'] == 'get_likes' && req.query['photo_id'] && req.query['user_id'])
		user_controller.get_likes(req, res);
	else if (req.query['action'] == 'get_avatar' && req.query['user_id'])
		user_controller.get_avatar(req, res);
	else if (req.query['action'] == 'find_users' && req.query['user_id'] && req.session.user_id)
		user_controller.find_users(req, res);
	else if (req.query['action'] == 'add_friend' && req.query['user_id'] && req.session.user_id && req.session.user_id != req.query['user_id'])
		user_controller.add_friend(req, res);
	else if (req.query['action'] == 'del_friend' && req.query['user_id'] && req.session.user_id && req.session.user_id != req.query['user_id'])
		user_controller.del_friend(req, res);
	else if (req.query['action'] == 'is_friend' && req.query['user_id'] && req.session.user_id && req.session.user_id != req.query['user_id'])
		user_controller.is_friend(req, res);
	else if (req.query['action'] == 'get_requests' && req.session.user_id)
		user_controller.get_requests(req, res);
	else if ((req.query['action'] == 'confirm_friend' || req.query['action'] == 'refuse_friend') && req.query['user_id'] && req.session.user_id)
		user_controller.confirm_friend(req, res);
	else if (req.query['action'] == 'get_friends' && req.session.user_id)
		user_controller.get_friends(req, res);
	else if (req.query['action'] == 'get_chats' && req.session.user_id)
		user_controller.get_chats(req, res);
	else if (req.query['action'] == 'get_room' && req.query['user_id'] && req.session.user_id && req.query['user_id'] != req.session.user_id)
		user_controller.get_room(req, res);
	else if (req.query['action'] == 'invite_list' && req.query['room_id'] && req.session.user_id)
		user_controller.invite_list(req, res);
	else if (req.query['action'] == 'add_to_chat' && req.query['room_id'] && req.query['user_id'] && req.session.user_id && req.session.user_id != req.query['user_id'])
		user_controller.add_to_chat(req, res);
	else if (req.query['action'] == 'add_hashtag' && req.query['user_id'] && req.session.user_id && req.query['user_id'] == req.session.user_id && req.query['text'] && req.query['text'].trim() != '')
		user_controller.add_hashtag(req, res);
	else if (req.query['action'] == 'get_tags' && req.query['user_id'])
		user_controller.get_tags(req, res);
	else if (req.query['action'] == 'copy_hashtag' && req.query['tag_id'] && req.session.user_id && req.query['tag_name'] && req.query['tag_name'] != '')
		user_controller.copy_hashtag(req, res);
	else if (req.query['action'] == 'auto_complete' && req.query['to_find'] && req.query['to_find'] != '' && req.query['find_from'] && req.query['find_from'] != '')
		user_controller.auto_complete(req, res);
	else if (req.query['action'] == 'get_unread_messages' && req.session.user_id && req.session.user_id != '')
		user_controller.get_unread_messages(req, res);
	else if (req.query['action'] == 'is_blocked' && req.session.user_id && req.session.user_id != '' && req.query['user_id'] && req.query['user_id'] != '' && req.query['user_id'] != req.session.user_id)
		user_controller.is_blocked(req, res);
	else if (req.query['action'] == 'get_history' && req.session.user_id && req.session.user_id != '')
		user_controller.get_history(req, res);
	else if (req.query['action'] == 'get_rating' && req.query['user_id'] && req.query['user_id'] != '')
		user_controller.get_rating(req, res);
	else if (req.query['action'] == 'get_visits' && req.session.user_id && req.session.user_id != '' && req.query['button_id'] && req.query['button_id'] != '')
		user_controller.get_visits(req, res);
	else if (req.query['action'] == 'check_fake' && req.session.user_id && req.session.user_id != '' && req.query['user_id'] && req.query['user_id'] != '')
		user_controller.check_fake(req, res);
	else {
		res.send({
			success: false,
			error: 'Invalid request',
			request: req.query
		});
	}
});

router.post('/ajax_post', upload.any(), function(req, res, next) {
	if (req.body['action'] == 'upload_photo' && req.body['user_id'] == req.session.user_id && req.files)
		user_controller.upload(req, res);
	else if (req.body['action'] == 'get_album' && req.body['user_id'])
		user_controller.get_album(req, res);
	else if ((req.body['action'] == 'del_user' || req.body['action'] == 'change_admin' || req.body['action'] == 'change_active') && req.body['id']) {
		
		var sql = "SELECT * FROM users WHERE id = ?;";
		db.query(sql, req.session.user_id, function(err, rows) {
			var curr_user = rows[0];
			if (!Admin.check_access(req, res, curr_user))
				return ;
			if (req.body['action'] === 'del_user')
				Admin.del_user(req, res);
			else if (req.body['action'] == 'change_admin' || req.body['action'] == 'change_active')
				Admin.change_admin_active(req, res);
		});
	}
	else if (req.body['action'] == 'get_users' && req.body['authors[]'])
		user_controller.get_users(req, res);
	else if (req.body['action'] == 'get_avatars' && req.body['list[]'])
		user_controller.get_avatars(req, res);
	else if (req.body['action'] == 'del_photo' && req.body['photo_id'] && req.body['user_id'] == req.session.user_id)
		user_controller.del_photo(req, res);
	else if (req.body['action'] == 'get_messages' && req.body['room_id'] && req.session.user_id)
		user_controller.get_messages(req, res);
	else if (req.body['action'] == 'send_message' && req.body['room_id'] && req.body['text'] && req.body['text'].trim() != '' && req.session.user_id)
		user_controller.send_message(req, res);
	else if (req.body['action'] == 'del_hashtag' && req.body['tag_id'] && req.session.user_id)
		user_controller.del_hashtag(req, res);
	else if (req.body['action'] == 'update_unread_messages' && req.body['room_id'] && req.body['room_id'] != '' && req.session.user_id && req.session.user_id != '')
		user_controller.update_unread_messages(req, res);
	else if (req.body['action'] == 'update_rating' && req.body['user_id'] && req.body['user_id'] != '0' && req.body['points'] && req.body['points'] != 0 && req.body['points'] != '')
		user_controller.update_rating(req, res);
	else if (req.body['action'] == 'block_user' && req.body['user_id'] && req.body['user_id'] != '' && req.session.user_id && req.session.user_id != '' && req.session.user_id != req.body['user_id'])
		user_controller.block_user(req, res);
	else if (req.body['action'] == 'read_history' && req.session.user_id && req.session.user_id != '')
		user_controller.read_history(req, res);
	else if (req.body['action'] == 'insert_history' && req.session.user_id && req.session.user_id != '' &&
			req.body['owner'] && req.body['owner'] != '' && req.body['owner'] != req.session.user_id &&
			req.body['type'] && req.body['type'] != '' && (req.body['confirm'] !== null || req.body['type'] != 'request'))
		user_controller.insert_history(req, res);
	else if (req.body['action'] == 'fake_user' && req.body['user_id'] && req.body['user_id'] != '' && req.session.user_id && req.session.user_id != '' && req.body['user_id'] != req.session.user_id)
		user_controller.fake_account(req, res);
	else {
		res.send({
			success: false,
			error: 'Invalid request',
			request: req.query
		});
	}
});

module.exports = router;
