var mysql = require('mysql');
var conn = require('./connection.js');
var db_start = require('./db_start.js');
var Fakerator = require("fakerator");
var hash = require('password-hash');
var fs = require('fs');
var shell = require('shelljs');
var AvatarGenerator = require('avatar-generator')
var avatar = new AvatarGenerator({
    parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'],
    imageExtension: '.png'
});

function create_users() {
	var sql = "CREATE TABLE IF NOT EXISTS users (\
		id INT(6) AUTO_INCREMENT PRIMARY KEY,\
		login VARCHAR(50) NOT NULL UNIQUE,\
		password VARCHAR(100) NOT NULL,\
		email VARCHAR(255) NOT NULL UNIQUE,\
		first_name VARCHAR(50),\
		last_name VARCHAR(50),\
		admin TINYINT(1) NOT NULL DEFAULT 0,\
		active TINYINT(1) NOT NULL DEFAULT 1,\
		about VARCHAR(500),\
		age INT(3) UNSIGNED,\
		gender ENUM('Male', 'Female', 'Other'),\
		orientation ENUM('Heterosexual','Homosexual','Bisexual','Asexual','Other'),\
		last_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\
		connected TINYINT(1) NOT NULL DEFAULT 0,\
		rating INT(11) NOT NULL DEFAULT 0\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_sample_data() {
	conn.query(db_start, {}, function(err) {
		if (err)
			console.log(err);
	});
}

function create_photo() {
	var sql = "CREATE TABLE IF NOT EXISTS photo (\
		id INT(6) AUTO_INCREMENT PRIMARY KEY,\
		user_id INT(6) NOT NULL,\
		url VARCHAR(255) NOT NULL,\
		avatar TINYINT(1) NOT NULL DEFAULT 0\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_comments() {
	var sql = "CREATE TABLE IF NOT EXISTS comments (\
		id INT(6) AUTO_INCREMENT PRIMARY KEY,\
		photo INT(6) NOT NULL,\
		author INT(6) NOT NULL,\
		text VARCHAR(400) NOT NULL,\
		time TIMESTAMP NOT NULL DEFAULT now()\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_likes() {
	var sql = "CREATE TABLE IF NOT EXISTS likes (\
		id INT(6) AUTO_INCREMENT PRIMARY KEY,\
		photo_id INT(6) NOT NULL,\
		author INT(6) NOT NULL\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_friends() {
	var sql = "CREATE TABLE IF NOT EXISTS friends (\
		id1 INT(6) NOT NULL,\
		id2 INT(6) NOT NULL,\
		active TINYINT(1) NOT NULL DEFAULT 0\
	)";
}

function create_messages() {
	var sql = "CREATE TABLE IF NOT EXISTS messages (\
		id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		author INT(6) NOT NULL,\
		dest_user INT(6),\
		text VARCHAR(500) NOT NULL,\
		time TIMESTAMP NOT NULL DEFAULT now(),\
		room_id INT(6) NOT NULL\
	)";
	var rel_sql = "CREATE TABLE IF NOT EXISTS message_user (\
		id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		message_id INT(6) NOT NULL,\
		user_id INT(6) NOT NULL,\
		read_date TIMESTAMP NOT NULL DEFAULT now()\
	)";
	var queries = [sql, rel_sql];
	for (var i = 0; i < queries.length; i++) {
		conn.query(queries[i], function(err) {
			if (err)
				console.log(err);
		});
	}
}

function create_rooms() {
	var room_sql = "CREATE TABLE IF NOT EXISTS rooms (\
	    id INT(6) AUTO_INCREMENT PRIMARY KEY,\
	    active TINYINT(1) NOT NULL DEFAULT 1,\
	    private TINYINT(1) NOT NULL DEFAULT 1\
	)";
	var room_user_sql = "CREATE TABLE IF NOT EXISTS room_user (\
		room_id INT(6) NOT NULL,\
	    user_id INT(6) NOT NULL\
	)";
	var queries = [room_sql, room_user_sql];
	for (var i = 0; i < queries.length; i++) {
		conn.query(queries[i], function(err) {
			if (err)
				console.log(err);
		});
	}
}

function create_hashtags() {
	var sql = "CREATE TABLE IF NOT EXISTS hashtags (\
		id INT(10) AUTO_INCREMENT PRIMARY KEY,\
		name VARCHAR(30) NOT NULL,\
		user_id INT(6) NOT NULL\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_locations() {
	var sql = "CREATE TABLE IF NOT EXISTS locations (\
		id INT(6) AUTO_INCREMENT PRIMARY KEY,\
		user_id INT(6) NOT NULL UNIQUE,\
		latitude FLOAT(20) NOT NULL,\
		longitude FLOAT(20) NOT NULL,\
		approved TINYINT(1) NOT NULL,\
		city VARCHAR(100) DEFAULT \'\'\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_black_list() {
	var sql = "CREATE TABLE IF NOT EXISTS black_list (\
		id INT(6) AUTO_INCREMENT PRIMARY KEY,\
		blocker INT(6) NOT NULL,\
		blocked INT(6) NOT NULL\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_links() {
	var sql = "CREATE TABLE IF NOT EXISTS links (\
		id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		user_id INT(6) NOT NULL,\
		hash VARCHAR(100)\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_reports() {
	var sql = "CREATE TABLE IF NOT EXISTS fake_reports (\
		id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		reporter INT(6) NOT NULL,\
		reported INT(6) NOT NULL\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_history() {
	var sql = "CREATE TABLE IF NOT EXISTS history (\
		id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		owner INT(6) NOT NULL,\
		visitor INT(6) NOT NULL,\
		type ENUM('visit', 'request', 'block', 'remove') NOT NULL,\
		confirm TINYINT(1),\
		time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\
		reviewed TINYINT(1) NOT NULL DEFAULT 0\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_tmp() {
	var sql = "CREATE TABLE IF NOT EXISTS tmp_cont (\
		id INT(11) NOT NULL\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function insert_users(users, res) {
	var sql = "INSERT INTO users (login, password, email, first_name, last_name, admin, active, about, age, gender, orientation) VALUES ";
	var inserted = {};
	for (var i = 0; i < users.length; i++) {
		if (i > 0)
			sql += ", ";
		sql += '("' + users[i].login + '", "' + users[i].password + '", "' + users[i].email + '", "' + users[i].first_name + '", "' + users[i].last_name + '", "' +
			users[i].admin + '", "' + users[i].active + '", "' + users[i].about + '", "' + users[i].age + '", "' + users[i].gender + '", "' + users[i].orientation + '")';
	}
	console.log(sql);
	conn.query(sql, {}, function(err) {
		if (err) {
			res.redirect('/error?error=' + err.sqlMessage);
			return ;
		}
		else {
			sql = "SELECT id, login FROM users";
			conn.query(sql, {}, function(err, rows) {
				if (err) {
					res.redirect('/error?error=' + err.sqlMessage);
					return ;
				}
				else {
					var p_sql = "INSERT INTO photo (user_id, url, avatar) VALUES ";
					var l_sql = "INSERT INTO locations (user_id, latitude, longitude, approved, city) VALUES ";
					for (var i = 0; i < rows.length; i++) {
						inserted[rows[i]['login']] = rows[i]['id'];
					}
					console.log(inserted);
					for (var i = 0; i < users.length; i++) {
						if (i > 0) {
							p_sql += ", ";
							l_sql += ", ";
						}
						p_sql += '("' + inserted[users[i]['login']] + '", "' + users[i].avatar + '", "1")';
						l_sql += '("' + inserted[users[i]['login']] + '", "' + users[i].latitude + '", "' + users[i].longitude + '", "1", "' + users[i].city + '")';
					}
					sql = p_sql + ";" + l_sql;
					conn.query(sql, {}, function(err) {
						if (err) {
							console.log(err.sqlMessage);
							return ;
						}
						else
							res.redirect('/');
					});
				}
			})
		}
	});
}

async function generate_users(nb, res) {
	var fakerator = Fakerator();
	var orientations = ['Heterosexual','Homosexual','Bisexual','Asexual','Other'];
	var genders = ['Male', 'Female'];
	var gend_short = ["M", "F"];
	var default_pass = hash.generate('11111111', {algorithm: 'sha256'});
	var users = [];
	

	for (var i = 0; i < nb; i++) {
		const variant = genders[i % 2].toLowerCase();
		var user = {};
		user.password = default_pass;
		var new_user = fakerator.entity.user(gend_short[i % 2]);
		user.gender = genders[i % 2];
		user.orientation = fakerator.random.arrayElement(orientations);
		user.age = fakerator.date.age(12, 100);
		user.about = fakerator.lorem.paragraph();
		user['admin'] = 0;
		user['active'] = 1;
		user.login = new_user['userName'] + i;
		user.first_name = new_user['firstName'];
		user.last_name = new_user['lastName'];
		user.email = i + new_user['email'];
		user.avatar = new_user['avatar'];
		user.city = new_user['address']['city'];
		user.latitude = new_user['address']['geo']['latitude'];
		user.longitude = new_user['address']['geo']['longitude'];
		const image = await avatar.generate(user.email, variant);
		var path = get_upload_path(user.login);
		if (!fs.existsSync('public' + path)) {
			shell.mkdir('-p', 'public' + path);
			image.png().toFile('public' + path + 'avatar.png').catch(function(err) {
				console.log(err);
			});
		}
		user['avatar'] = path + 'avatar.png';
		users.push(user);
	}
	insert_users(users, res);
}

function get_upload_path(id) {
	if (!id)
		return (false);
	var today = new Date();
	return ('/uploads/' + id + '/' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '/');
}

module.exports = {
	install: function(res) {
		create_users();
		create_photo();
		create_comments();
		create_likes();
		create_friends();
		create_messages();
		create_rooms();
		create_locations();
		create_black_list();
		create_links();
		create_reports();
		create_history();
		create_tmp();
		setTimeout(function() {
			create_sample_data();
			generate_users(500, res);
		}, 3000);
	}
}
