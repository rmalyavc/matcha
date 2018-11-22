var mysql = require('mysql');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Stanly106601",
  database: "matcha"
});

conn.connect(function(err) {
  if (err) 
  	throw err;
  console.log("Connected to Database");
});

module.exports = conn;