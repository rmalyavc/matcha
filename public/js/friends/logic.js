var chat_with = '';


function uncheck_users(elem_id) {
	var cont = document.getElementsByClassName('friends_wrapper')[0];
	var inputs = cont.getElementsByTagName('input');

	for (var i = 0; i < inputs.length; i++)
		if (inputs[i].id != elem_id)
			inputs[i].checked = false;
}

function fill_chat_list(cont, friend) {
	var avatar = friend.avatar ? friend.avatar : '/images/default_avatar.png';

	cont.innerHTML += '<div class="chat_user" id="chat_' + friend.id + '" onclick="start_chat(this.id);">\
		<div class="req_avatar" style="background-image:url(\'' + avatar + '\');"></div>\
		<div class="req_info">\
			<h4 class="text_header">' + friend.login + '</h4>\
			<i class="text_header" id="last_message">No recent messages...</i>\
		</div>\
	</div>';
}

function post_friend(cont, friend) {
	var avatar = friend.avatar ? friend.avatar : '/images/default_avatar.png';
	var age = friend.age ? friend.age : '?';
	var about = friend.about ? friend.about : '?';
	var full_name = friend.first_name ? friend.first_name + ' ' : '';

	if (friend.last_name)
		full_name += friend.last_name;
	cont.innerHTML += '\
		<div class="friend_cont">\
			<div class="check_cont">\
				<input type="radio" id="' + friend.id + '">\
			</div>\
				<div class="avatar" style="background-image:url(' + "'" + avatar + "'" + ');"></div>\
				<a href="/users/profile/' + friend.id + '">\
					<div class="friend_info">\
						<div class="friend_info_wrapper">\
							<label class="admin_label">Login:</label><span>' + friend.login + '</span><br>\
							<label class="admin_label">Full Name:</label><span>' + full_name + '</span><br>\
							<label class="admin_label">Age:</label><span>' + age + '</span><br>\
							<label class="admin_label about_label">About me:</label>\
							<div class="search_about">' + about + '</div>\
						</div>\
					</div>\
				</a>\
		</div>';
	radio_listeners();
}

function post_friends(cont_id, funct) {
	var cont = document.getElementById(cont_id);
	// var cont = document.getElementsByClassName('friends_wrapper')[0];
	// var cont = document.getElementById('chat_list').getElementsByClassName('chat_wrapper')[0];

	// console.log(document.getElementById('friends_window'));
	cont.innerHTML = '';
	$.get('/users/ajax', {action: 'get_friends'}, function(res) {
		if (!res.success)
			cont.innerHTML = '<h3 class="text_header error_text">' + res.error + '</h3>';
		else if (res.data.length < 1)
			cont.innerHTML = '<h3 class="text_header error_text">No friends found =(</h3>';
		else
			for (var i = 0; i < res.data.length; i++)
				funct(cont, res.data[i]);
	});
}

function friends() {
	fog_visible('fog', true, false);
	post_friends('friends_cont', post_friend);
}

function proceed_action() {
	var res_win = document.getElementById('action_result');
	var text = res_win.getElementsByClassName('text_header')[0];
	var action = document.getElementById('friend_action');
	var data = document.getElementById('friend_data');
	var back = document.getElementById('result_back');
	var req = {action: action.value};

	req[data.getAttribute('name')] = data.value;
	$.get('/users/ajax', req, function(res) {
		res_win.style.display = 'block';
		fog_visible('friend_fog', true, false);
		if (!res.success) {
			text.setAttribute('class', text.getAttribute('class') + ' ' + 'error_text');
			text.innerHTML = res.error;
		}
		else {
			text.setAttribute('class', text.getAttribute('class') + ' ' + 'green');
			text.innerHTML = 'Friend is successfuly deleted';
		}
		post_friends('friends_cont', post_friend);
		back.onclick = function() {
			res_win.style.display = 'none';
			fog_visible('friend_fog', false, true);
		}
	});
}

function post_message(message, is_owner) {
	console.log(message);
	var cont = document.getElementById('chat_messages');
	var add_class = is_owner ? ' owner' : '';

	cont.innerHTML += '<span class="message_time' + add_class + '">' + message.time + '</span><br><strong class="message_login' + add_class + '">' + message.login + '</strong><div class="message_wrapper' + add_class + '">\
		<div class="message' + add_class + '">\
			<p class="message_text">' + message.text + '</p>\
		</div>\
	</div>';
}

function post_messages(user_id) {
	var cont = document.getElementById('chat_messages');

	$.post('/users/ajax_post', {action: 'get_messages', user_id: user_id}, function(res) {
		if (!res.success) {
			console.log(res.error);
			return ;
		}
		cont.innerHTML = '';
		for (var i = 0; i < res.data.length; i++) {
			post_message(res.data[i], res.data[i].author != user_id);
		}
		var target = cont.scrollTop + cont.offsetHeight * 42000;
    	$('#chat_messages').animate({scrollTop: target}, 0);
	});
}


function start_chat(cont_id) {
	var list = document.getElementsByClassName('chat_user');

	// console.log(Array.isArray(cont_id));
	if (Array.isArray(cont_id))
		cont_id = cont_id[0];
	chat_with = cont_id.replace('chat_', '');
	for (var i = 0; i < list.length; i++) {
		var list_id = list[i].id;
		list[i].style['background'] = (list[i].id == cont_id) ? "rgba(200,200,200,0.2)" : 'none';
	}
	console.log(cont_id);
	// var user_id = cont_id.replace('chat_', '');
	post_messages(chat_with);
}

function chat_action(user_id) {
	var chat = document.getElementById('chat_window');
	
	chat.style.display = 'block';
	post_friends('chat_list', fill_chat_list);
	wait_elem('id_name', 'chat_' + user_id, document, start_chat, ['chat_' + user_id]);
}

function del_action() {
	var full_size = document.getElementById('friends_window');
	var text = document.getElementById('friend_confirm');
	var yes = document.getElementById('yes_del');
	var no = document.getElementById('no_del');
	var checked = full_size.querySelector('input:checked');
	var action = document.getElementById('friend_action');
	var data = document.getElementById('friend_data');

	if (!checked)
		return ;
	$.get('/users/ajax', {action: 'get_user', id: checked.id}, function(res) {
		if (!res) {
			console.log('User is not found');
			return ;
		}
		text.innerHTML = 'Do you really want to delete ' + res.login + ' from friends?';
		fog_visible('friend_fog', true, true);
		no.onclick = function() {
			fog_visible('friend_fog', false, true);
		}
		yes.onclick = function() {
			action.value = 'del_friend';
			data.value = checked.id;
			data.setAttribute('name', 'user_id');
			proceed_action();
		}
	});
}

function send_message() {
	// var socket = io();
	var input = document.getElementById('message_input');

	if (!input || input.value.trim() == '' || !chat_with || chat_with == '')
		return ;
	$.post('/users/ajax_post', {action: 'send_message', text: input.value.trim(), user_id: chat_with}, function(res) {
		// socket.emit('chat message', $('#m').val());
		socket.emit('chat message', input.value.trim());
		input.value = '';
		if (!res.success) {
			console.log(res.error);
			return ;
		}
		post_messages(chat_with);
	});
}

function action(elem_id) {
	var full_size = document.getElementById('friends_window');
	var checked = full_size.querySelector('input:checked');

	if (!checked) {
		alert('Select a user');
		return ;
	}
	if (elem_id == 'del_friend')
		del_action();
	else if (elem_id == 'chat_button')
		chat_action(checked.id);
	else if (elem_id == 'send_message')
		send_message();
}

$(document).ready(function() {
	tools_listeners();
	chat_listeners();
	friends();
});
