const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	login: {type: String, unique: true, required: true, minlength: 4, maxlength: 50},
	password: {type: String, required: true},
	email: {type: String, required: true, unique: true, maxlength: 50},
	first_name: {type: String, required: false, default: '', minlength: 3, maxlength: 50},
	last_name: {type: String, required: false, default: '', minlength: 3, maxlength: 50},
	admin: {type: Boolean, default: false},
	active: {type: Boolean, default: true},
	about: {type: String, default: '', required: false, maxlength: 500}
}, {collection: 'users'});

module.exports = mongoose.model('User', UserSchema);

// var url = 'mongodb://localhost:27017/test';

// var valid = require('./validators/user/valid_user.js');

// module.exports = {
// 	register: function(data, err) {
// 		var new_user = {};

// 		if (!valid_register_data(data)) {
// 			err.push('Invalid data');
// 			return (false);
// 		}

// 		new_user['login'] = data['login'];
// 		new_user['password'] = data['password'];
// 		new_user['email'] = data['email'];
// 		mongo.connect(url, function(err, client) {
// 			var db = client.db('test');
// 			assert.equal(null, err);
// 			db.collection('users').insertOne(new_user, function(err, result) {
// 				result['test'] = 'testtest';
// 				assert.equal(null, err);
// 				db.close();
// 			});
// 		});
// 		return (true);
// 	}
// }