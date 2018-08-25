const mongo = require('mongodb').MongoClient;
const assert = require('assert');

var url = 'mongodb://localhost:27017/test';

function is_email(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function valid_register_data(data) {
	return (data['login'] !== '' && data['password'] !== '' &&
			data['password_again'] !== '' && data['password'] === data['password_again'] &&
			data['email'] != '' && is_email(data['email']));
}

module.exports = {
	fuck_that: function() {
		return ('It workes!');
	},
	test: function() {
		return('Fuck that!!!');
		// if (!valid_register_data(null)) {
		// 	// result['error'] = 'Invalid data';
		// 	return (false);
		// }
		// // var new_user = {};
		// // new_user['login'] = data['login'];
		// // new_user['password'] = data['password'];
		// // new_user['email'] = data['email'];
		// // mongo.connect(url, function(err, db) {
		// // 	// assert.equal(null, err);
		// // 	db.collection('users').insertOne(new_user, function(err, result) {
		// // 		// assert.equal(null, err);
		// // 		db.close();
		// // 	});
		// // });
		// return (true);
	}
}
//   foo: function () {
//     // whatever
//   },
//   bar: function () {
//     // whatever
//   }
// };

// var zemba = function () {
// }
