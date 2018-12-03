var express = require('express');
var router = express.Router();
var Admin = require('./controllers/Admin.js');
// var User = require('./models/User.js');
var install = require('./config/install.js');
var db = require('./config/connection.js');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var server = app.listen(3001);
// var io = require('socket.io')(server);
// var server = require('http').createServer(app);
// var io = require('socket.io')(server);
// server.listen(3001);
// var server = app.listen(3001);
// var io = require('socket.io').listen(server);

// var io = require('socket.io');
// server = express().use(app).listen(3001, function() {
// 		console.log(`Listening Socket on 3001`);
// 		server.on('chat message', function(msg){
// 			console.log('message: ' + msg);
// 		});
// 	}
// );

/* GET home page. */
router.get('/', function(req, res, next) {
	req.session.user = 'rest';
	var data = req.session.user;
	res.render('index', {
		title: 'Matcha',
		created_by: 'Roman Malyavchik',
		logged_user: req.session.user_id,
		user_login: req.session.user_login
	});
});

router.get('/error', function(req, res, next) {
	res.render('error', {
		logged_user: req.session.user_id,
		error: req.query.error,
		image: req.query.image
	});
});

router.get('/admin', async function(req, res, next) {
	var sql = "SELECT * FROM users WHERE id = ?;";
	// var curr_user = await db.query(sql);
	
	// var curr_user = await User.findById(req.session.user_id).exec();
	db.query(sql, req.session.user_id, function(err, rows) {
		if (err) {
			res.redirect('/error?error=' + err);
			return ;
		}
		if (!Admin.check_access(req, res, rows[0]))
			return ;
		res.render('admin', {
			logged_user: req.session.user_id,
			user_login: req.session.user_login
		});
	});
});

router.get('/install', function(req, res) {
	install.install();
	res.redirect('/');
});

io.on('connect', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3001, function(){
  console.log('listening on *:3000');
});

// io.on('connect', function(socket){
// 	// io.emit('set users', "A user connected");
// 	console.log('socket is:');
// 	// socket.on('onConnected', function() {
// 	//     console.log('New Connection Established!');
// 	//     socket.close();
// 	// });
	
// 	// socket.on('disconnect', function(){
// 	//     console.log('user disconnected');
// 	//     socket.removeAllListeners('send message');
// 	//     socket.removeAllListeners('disconnect');
// 	//     io.removeAllListeners('connection');
// 	// });
// 	// console.log(socket.client);
// 	// console.log('Socket connection test');
// 	socket.on('chat message', function(msg){
// 		console.log('message: ' + msg);
// 	});
// });

// http.listen(3001, function(){
//   	io.on('connection', function(socket){
// 		console.log('a user connected');
// 		socket.on('disconnect', function(){
// 		    console.log('user disconnected');
// 	  	});
// 	});
// });

module.exports = router;
