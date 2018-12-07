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
	// console.log(socket.options);
	socket.on('add_client', function(data){
	    clients[data.user_id] = {
	    	"socket": socket.id
	    };
	    // console.log('Clients are:');
	    // console.log(clients);
	});
	// clients.push(socket.id);
	
	// console.log(clients);
	socket.on('send_message', function(msg){
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
		// var to_send = ['3'];
		// for (var i = 0; i < to_send.length; i++) {
			
		// }
	  	// console.log(socket);
	  	// console.log(io.sockets.connected[2]);
	  	// io.sockets.connected[2].emit('chat message', msg.text);
	  	// io.emit('chat message', msg.text, 2);
	    console.log('message: ' + msg.text);
	    console.log('room: ' + msg.room_id);
	});
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});