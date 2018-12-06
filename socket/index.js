var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('send_message', function(msg){
  	io.emit('chat message', msg.text);
    console.log('message: ' + msg.text);
    console.log('room: ' + msg.room_id);
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});