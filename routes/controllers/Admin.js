var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test', { useNewUrlParser: true });
var db = require('../config/connection.js');

module.exports = {
	get_all_users: function(req, res) {
		var sql = "SELECT * FROM users;";

		db.query(sql, function(err, rows) {
			if (err) {
				res.send({
					success: false,
					error: err
				});
			}
			else {
				res.send({
					success: true,
					users: rows
				});
			}
		});
	},
	remove_all_users: function(req, res) {
		var sql = "DELETE FROM users;";

		db.query(sql, function(err) {
			if (err)
				res.send(err);
			else
				res.send('All users are removed');
		});
	},
	check_access: function(req, res, curr_user) {
		if (!req.session.user_id || !curr_user) {
			res.redirect('/users/login');
			return (false);
		}
		else if (!curr_user.admin) {
			res.redirect('/error?image=/images/forbidden.png');
			return (false);
		}
		return (true);
	},
	del_user: function(req, res) {
		var sql = "DELETE FROM users WHERE id = ?;";

		db.query(sql, req.body['id'], function(err) {
			if (err)
				res.send({success: false, error: err});
			else
				res.send({success: true});
		});
	},
	change_admin_active: function(req, res) {
		var field = req.body['action'] == 'change_admin' ? 'admin ' : 'active ';

		var sql = "UPDATE users SET " + field + "= CASE WHEN " + field + "= 0 THEN 1 ELSE 0 END WHERE id = ?;";
		db.query(sql, req.body['id'], function(err) {
			console.log('ERR IS ' + err);
			if (err)
				res.send({success: false, error: err});
			else
				res.send({success: true});
		});
	}
}