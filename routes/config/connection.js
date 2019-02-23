var mysql = require('mysql');

var conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Stanly106601",
	database: "matcha",
	multipleStatements: true
});

var db_conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Stanly106601"
});

db_conn.connect(function(err) {
	if (err)
		throw err;
	else {
		var sql = "CREATE DATABASE IF NOT EXISTS matcha";
		db_conn.query(sql, {}, function(err) {
			conn_try = true;
			if (err)
				throw err;
		});
	}
});

setTimeout(function() {
	conn.connect(function(err) {
		if (err)
			console.log(err);
		else
			console.log('Connected to Database');
	});		
}, 1000);

module.exports = conn;