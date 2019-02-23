var app = require('express')();
var http = require('http').Server(app);
const config = {pingTimeout: 60000};
var io = require('socket.io')(http, config);
var mysql = require('mysql');

var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Stanly106601",
	database: "matcha"
});

var clients = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	socket.on('add_client', function(data){
		socket.user_id = data.user_id;
	    clients[data.user_id] = {
	    	"socket": socket.id
	    };
	    var sql = "UPDATE users SET connected = 1 WHERE id = ?";
	    db.query(sql, socket.user_id, function(err) {
	    	if (err)
	    		console.log(err.sqlMessage);
	    	else {
				var keys = Object.keys(clients);
				for (var i = 0; i < keys.length; i++) {
					if (io.sockets.connected[clients[keys[i]]['socket']] && keys[i] != socket.user_id)
						io.sockets.connected[clients[keys[i]]['socket']].emit('user_connected', {user_id: socket.user_id});
				}
			}
	    });
	});
	socket.on('send_message', function(msg){
		var sql = "SELECT user_id FROM room_user WHERE room_id = ?";

		db.query(sql, msg.room_id, function(err, rows) {
			if (err)
				console.log(err.sqlMessage);
			else {
				for (var i = 0; i < rows.length; i++) {
					if (clients[rows[i]['user_id']])
						io.sockets.connected[clients[rows[i]['user_id']]['socket']].emit('chat message', {room_id: msg.room_id});
				}
			}
		});
	});

	socket.on('friend_request', function(query) {
		if (clients[query['user_id']])
			io.sockets.connected[clients[query['user_id']]['socket']].emit('friend_request');
	});

	socket.on('history_request', function(query) {
		if (clients[query['user_id']])
			io.sockets.connected[clients[query['user_id']]['socket']].emit('history_request');
		else
			console.log("User " + query['user_id'] + ' isn\'t connected');
	});

	socket.on('disconnect', function () {
		console.log('User ' + socket.user_id + ' is disconnected!');
		if (!socket.user_id)
			return ;
		var sql = "UPDATE users SET connected = 0, last_seen = NOW() WHERE id = ?";
		db.query(sql, socket.user_id, function(err) {
			if (err)
				console.log(err.sqlMessage);
			else {
				var keys = Object.keys(clients);
				for (var i = 0; i < keys.length; i++) {
					if (io.sockets.connected[clients[keys[i]]['socket']] && keys[i] != socket.user_id)
						io.sockets.connected[clients[keys[i]]['socket']].emit('user_disconnected', {user_id: socket.user_id});
				}
			}
		});
		delete clients[socket.user_id];
	});
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});