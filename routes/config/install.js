const conn = require('./connection.js');

function create_users() {
	var sql = "CREATE TABLE users (\
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
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_photo() {
	var sql = "CREATE TABLE photo (\
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
	var sql = "CREATE TABLE comments (\
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
	var sql = "CREATE TABLE likes (\
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
	var sql = "CREATE TABLE friends (\
		id1 INT(6) NOT NULL,\
		id2 INT(6) NOT NULL,\
		active TINYINT(1) NOT NULL DEFAULT 0\
	)";
}

function create_messages() {
	var sql = "CREATE TABLE messages (\
		id INT(11) AUTO_INCREMENT PRIMARY KEY,\
		author INT(6) NOT NULL,\
		dest_user INT(6),\
		text VARCHAR(500) NOT NULL,\
		time TIMESTAMP NOT NULL DEFAULT now(),\
		room_id INT(6) NOT NULL\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	});
}

function create_rooms() {
	var room_sql = "CREATE TABLE rooms (\
	    id INT(6) AUTO_INCREMENT PRIMARY KEY,\
	    active TINYINT(1) NOT NULL DEFAULT 1,\
	    private TINYINT(1) NOT NULL DEFAULT 1\
	)";
	var room_user_sql = "CREATE TABLE room_user (\
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
	var sql = "CREATE TABLE hashtags (\
		id INT(10) AUTO_INCREMENT PRIMARY KEY,\
		name VARCHAR(30) NOT NULL,\
		user_id INT(6) NOT NULL\
	)";
	conn.query(sql, function(err) {
		if (err)
			console.log(err);
	})
}

module.exports = {
	install: function() {
		create_users();
		create_photo();
		create_comments();
		create_likes();
		create_friends();
		create_messages();
		create_rooms();
	}
}