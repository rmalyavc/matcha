var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });
var User = require('../models/User.js');
var user_validator = require('../validators/User.js');

module.exports = {
	register: function(data, res) {
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
			user.save().then(function(err){
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
			// .catch(function(err) {
			// 	console.log('oh No! It didn\'t work!');
			// 	console.log(err);
			// 	
			// });
			console.log('We are out of bounds(((');
		}
	}
}