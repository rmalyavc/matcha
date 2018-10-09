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
		User.findByIdAndRemove(req.body['id'], function(err) {
			if (err) {
				res.send({
					success: false,
					error: err
				});
			}
			else {
				res.send({
					success: true
				});
			}
		});
	},
	change_admin_active: function(req, res) {
		User.findById(req.body['id'], function(err, doc) {
			if (err || !doc) {
				res.send({
					success: false,
					error: err
				});
				return ;
			}
			if (req.body['action'] === 'change_admin') {
				doc.admin = !doc.admin ? true : false;
				console.log('Admin is: ' + doc.admin);
			}
			else if (req.body['action'] === 'change_active') {
				doc.active = !doc.active ? true : false;
				console.log('Active is: ' + doc.active);
			}
			doc.save().then(function() {
				res.send({success: true});
				return ;
			}).catch(function(err) {
				res.send({
					success: false,
					error: err
				});
			});
		});
	}
}