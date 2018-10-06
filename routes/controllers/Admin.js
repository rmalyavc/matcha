var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test', { useNewUrlParser: true });
var User = require('../models/User.js');
var Photo = require('../models/Photo.js');

module.exports = {
	get_all_users: function(req, res) {
		User.find({}, function(err, docs) {
			if (err)
				res.send({
					success: false,
					error: err
				});
			else
				res.send({
					success: true,
					users: docs
				});
		});
	},
	remove_all_users: function(req, res) {
		User.remove({}, function(err) {
			if (err) {
				console.log(err);
				res.send(err);
			}
			else
				res.send('Collection removed');
		});
	},
	check_access: function(req, res) {
		if (!req.session.user_id)
			res.redirect('/users/login');
		User.findById(req.session.user_id, function(err, doc) {
			if (err || !doc) {
				res.redirect('/error?error=' + err);
				return ;
			}
			if (!doc.admin) {
				res.redirect('/error?error=' + 'Access denied' + '&image=' + '/images/forbidden.png');
				return ;
			}
		});
	},
	del_user: function(req, res) {
		User.findByIdAndRemove(req.query['id'], function(err) {
			if (err) {
				res.send({
					success: false,
					error: err
				});
			}
			else {
				res.send({
					success: true
				})
			}
		});
	}
}

// res.redirect('/error?error=' + 'You cannot change another user\'s data!' + '&image=' + '/images/fuck.png');
			// return ;