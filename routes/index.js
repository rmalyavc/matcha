var express = require('express');
var router = express.Router();
var Admin = require('./controllers/Admin.js');
// var User = require('./models/User.js');
var install = require('./config/install.js');
var db = require('./config/connection.js');
var app = express();

var fs = require('fs');
var shell = require('shelljs');
var http = require('https');
var Fakerator = require("fakerator");

// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
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


router.get('/create_users', function(req, res) {
	var fakerator = Fakerator();
	var genders = ['Male', 'Female', 'Other'];
	var orientations = ['Heterosexual','Homosexual','Bisexual','Asexual','Other'];
	var users = [];
	var user = {};
	var get_names = {
		'Male': function() {
			user['first_name'] = fakerator.names.firstNameM();
			user['last_name'] = fakerator.names.lastNameM();
		},
		'Female': function() {
			user['first_name'] = fakerator.names.firstNameF();
			user['last_name'] = fakerator.names.lastNameF();
		},
		'Other': function() {
			user['first_name'] = fakerator.names.firstName();
			user['last_name'] = fakerator.names.lastName();
		}
	}
	for (var i = 0; i < 20; i++) {
		user = {};
		user['orientation'] = fakerator.random.arrayElement(orientations);
		user['gender'] = fakerator.random.arrayElement(genders);
		get_names[user['gender']]();
		user['login'] = fakerator.internet.userName(user['first_name'], user['last_name'] + i);
		user['email'] = fakerator.internet.email(user['first_name'], user['last_name'] + i);
		user['avatar'] = fakerator.internet.avatar();
		user['about'] = fakerator.lorem.paragraph();
		user['admin'] = 0;
		user['active'] = 1;
		user['age'] = fakerator.date.age(12, 100);
		var location = fakerator.address.geoLocation();
		user['latitude'] = location['latitude'];
		user['longitude'] = location['longitude'];
		users.push(user);
		if (i == 19) {
			var file = fs.createWriteStream("externalImage.jpg");
		    var request = http.get(user['avatar'], function(response) {
		      	response.pipe(file);
		      	console.log(file);	
		    });
			// var file = user['avatar'];
			var path = get_upload_path(user['login']);
			if (!fs.existsSync('public' + path))
				shell.mkdir('-p', 'public' + path);
			shell.mv(file['path'], 'public' + path + user['login'] + "\'s_photo.jpg");
		}
	}
	console.log(users);
});

function get_upload_path(id) {
	if (!id)
		return (false);
	var today = new Date();
	return ('/uploads/' + id + '/' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '/');
}
// io.on('connect', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });

// http.listen(3001, function(){
//   console.log('listening on *:3000');
// });
 

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
