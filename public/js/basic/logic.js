function hide_auto_complete(field) {
	var cont = field.parentElement.getElementsByClassName('auto_complete');

	if (field && cont && cont.length > 0)
		cont[0].style.display = 'none';
}

function select_option(field_id, option = false) {
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
			return ;
		else {
			var confirm = action == 'confirm_friend' ? 1 : 0;
			$.post('/users/ajax_post', {action: 'insert_history', owner: user_id, type: 'request', confirm: confirm}, function(res) {
				if (!res.success)
					return ;
				else {
					socket.emit('history_request', {
						user_id: user_id
					});	
				}
			});
			get_requests();
		}
	});
}

function post_request(req) {
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

function post_requests(data) {
	var button = document.getElementById('requests_button');
	var cont = document.getElementById('requests_cont');
	var qty = document.getElementById('req_qty');
	
	if (!button || !qty || !cont || !data)
		return ;

	$('.request').remove();
	for (var i = 0; i < data.length; i++) {
		post_request(data[i]);
	}
	setTimeout(function() {
		qty.innerHTML = $('.unread_message').length + $('.request').length + $('.history').length;	
		if ($('.unread_message').length + $('.request').length + $('.history').length < 1)
			cont.style.display = 'none';
	}, 1000);
}

function post_unread_messages(rows) {
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
	setTimeout(function() {
		qty.innerHTML = $('.unread_message').length + $('.request').length + $('.history').length;	
		if ($('.unread_message').length + $('.request').length + $('.history').length < 1)
			cont.hide();
	}, 1000);
}

function get_unread_messages() {
	$.get('/users/ajax', {action: 'get_unread_messages'}, function(res) {
		if (!res.success)
			return ;
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

function update_rating(user, nb) {
	$.post('/users/ajax_post', {action: 'update_rating', user_id: user, points: nb}, function(res) {
		if (!res.success)
			return ;
	});
}

function update_history() {
	$.get('/users/ajax', {action: 'get_history'}, function(res) {
		if (!res.success)
			return ;
		else
			post_history(res.data);
	});
}

function post_history(rows) {
	var qty = document.getElementById('req_qty');
	var cont = $('requests_cont');
	var html = '';

	$('.history').remove();
	for (var i = 0; i < rows.length; i++) {
		var avatar = rows[i].avatar ? rows[i].avatar : '/images/default_avatar.png';
		var message = 'User ' + rows[i].login;
		var text_class = 'green';
		if (rows[i].type == 'request')
			message += (rows[i].confirm == 0 && (text_class = 'error_text')) ? ' refused your request' : ' accepted your request';
		else if (rows[i].type == 'block' && (text_class = 'error_text'))
			message += ' blocked you';
		else if (rows[i].type == 'remove' && (text_class = 'error_text'))
			message += ' removed you from friends';
		else if (rows[i].type == 'visit')
			message += ' visited your page';
		html += '<div class="history">\
					<div class="req_avatar" style="background-image: url(' + "'" + avatar + "'" + ')"></div>\
					<a class="req_info" href="/users/profile/' + rows[i].visitor + '">\
						<span class="' + text_class + '">' + message + '</span>\
					</a>\
				</div>';
	}
	$('#requests_cont').append(html);
	setTimeout(function() {
		qty.innerHTML = $('.unread_message').length + $('.request').length + $('.history').length;	
		if ($('.unread_message').length + $('.request').length + $('.history').length < 1)
			cont.hide();
	}, 1000);
}

function requests_visible() {
	button = document.getElementById('requests_button');
	cont = document.getElementById('requests_cont');

	if (!button || !cont)
		return ;
	if (cont.style.display == 'none' || !cont.style.display)
		cont.style.display = 'block';
	else {
		cont.style.display = 'none';
		$.post('/users/ajax_post', {action: 'read_history'}, function(res) {
			if (!res.success)
				return ;
			else
				update_history();
		});
	}
}

if (socket) {
	socket.on('friend_request', function(){
		get_requests();
	});
	socket.on('chat message', function(msg){
		get_unread_messages();
	});
	socket.on('history_request', function(){
		update_history();
	});
}