var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
var User = require('../models/User.js');
var user_validator = require('../validators/User.js');

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
				password: data['password'],
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