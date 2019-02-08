function hide_auto_complete(field) {
	var cont = field.parentElement.getElementsByClassName('auto_complete');

	if (field && cont && cont.length > 0)
		cont[0].style.display = 'none';
}

function select_option(field_id, option = false) {
	console.log(option);
	var field = document.getElementById(field_id);
	if (option && field && option.value != '') {
		field.value = option.value;
		$('.auto_complete_row').remove();
		return ;
	}
	setTimeout(function() {
		hide_auto_complete(field)
	}, 200);
}

function auto_complete(field) {
	var cont = field.parentElement.getElementsByClassName('auto_complete');

	if (!cont || field.value.length < 2)
		return ;
	cont = cont[0];
	cont.innerHTML = '';
	$.get('/users/ajax', {action: 'auto_complete', find_from: field.id, to_find: field.value}, function(res) {
		if (!res.success) {
			console.log(res.error);
			return ;
		}
		var rows = res.data;
		for (var i = 0; i < rows.length; i++) {
			cont.innerHTML += '<input class="auto_complete_row" value="' + rows[i]['name'] + '" onclick="select_option(\'' + field.id + '\', this);">';
		}
		cont.style.display = 'block';
	});
}

function req_confirm(elem, user_id) {
	var action = elem.getAttribute('class') == 'req_tool req_refuse' ? 'refuse_friend' : 'confirm_friend';

	$.get('/users/ajax', {action: action, user_id: user_id}, function(res) {
		if (!res.success)
			console.log(res.error);
		else
			get_requests();
	});
}

function post_request(req) {
	console.log(req);

	var cont = document.getElementById('requests_cont');
	if (!cont)
		return ;
	var avatar = req.avatar ? req.avatar : '/images/default_avatar.png';
	cont.innerHTML += '<div class="request">\
		<div class="req_avatar" style="background-image: url(' + "'" + avatar + "'" + ')"></div>\
		<div class="req_info">\
			<a href="/users/profile/' + req.id + '">' + req.login + '</a><span>\ invites you to be friends</span>\
			<div class="req_tools">\
				<img class="req_tool req_confirm" onclick="req_confirm(this, ' + "'" + req.id + "'" + ');" src="/images/confirm.png">\
				<img class="req_tool req_refuse" onclick="req_confirm(this, ' + "'" + req.id + "'" + ');" src="/images/refuse.png">\
			</div>\
		</div>\
	</div>'
}
// background-image: url(' +
				// "'"  + res.album[i].url + "'" + ');
function post_requests(data) {
	var button = document.getElementById('requests_button');
	var cont = document.getElementById('requests_cont');
	var qty = document.getElementById('req_qty');
	
	if (!button || !qty || !cont || !data)
		return ;
	qty.innerHTML = data.length;
	// cont.innerHTML = '';
	$('.request').remove();
	for (var i = 0; i < data.length; i++) {
		post_request(data[i]);
	}
}

function post_unread_messages(rows) {
	console.log(rows);
	var qty = document.getElementById('req_qty');
	var cont = $('requests_cont');
	var total = 0;
	var html = '';

	$('.unread_message').remove();
	for (var i = 0; i < rows.length; i++) {
		total += parseInt(rows[i].total);
		var avatar = rows[i].avatar ? rows[i].avatar : '/images/default_avatar.png';
		var unit = total > 1 ? ' new messages ' : ' new message ';
		html += '<div class="unread_message">\
					<div class="req_avatar" style="background-image: url(' + "'" + avatar + "'" + ')"></div>\
					<a class="req_info" href="/users/friends?room_id=' + rows[i].room_id + '">\
						<span>You got ' + rows[i].total + unit + 'from&nbsp;' + rows[i].login + '</span>\
					</a>\
				</div>';
	}
	$('#requests_cont').append(html);
	qty.innerHTML = $('.unread_message').length + $('.request').length;
}

function get_unread_messages() {
	$.get('/users/ajax', {action: 'get_unread_messages'}, function(res) {
		if (!res.success)
			console.log(res.error);
		else
			post_unread_messages(res.data);
	});
}

function get_requests() {
	$.get('/users/ajax', {action: 'get_requests'}, function(res) {
		if (res.data)
			post_requests(res.data);
	});
}

function get_location() {
	navigator.geolocation.getCurrentPosition(function(location) {
		current_user.location = {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			approved: 1
		}
	}, function(err) {
		$.getJSON('https://geoip-db.com/json/').done(function(location) {
			current_user.location = {
				latitude: location.latitude,
				longitude: location.longitude,
				approved: 0
			}
		});
	});
}
if (socket) {
	socket.on('friend_request', function(){
		console.log('Friend request!');
		get_requests();
	});
}

