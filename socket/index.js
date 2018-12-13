var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
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
	});
	socket.on('send_message', function(msg){
		console.log('Send Message Event. Clients are:');
		console.log(clients);
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

	socket.on('disconnect', function () {
		console.log('User ' + socket.user_id + ' is disconnected!');
		delete clients[socket.user_id];
	});
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});