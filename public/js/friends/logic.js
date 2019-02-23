var chat_with = '';

socket.on('chat message', function(msg){
	if (msg.room_id == chat_with)
		post_messages(chat_with);
	else
		unread_messages();
});

function add_to_chat(elem) {
	$.get('/users/ajax', {action: 'add_to_chat', room_id: chat_with, user_id: elem.id}, function(res) {
		if (!res.success)
			return ;
		else {
			var win = document.getElementsByClassName('invite_to_chat')[0];
			win.style.display = null;
			chat_with = res.data;
			post_chats('chat_list');
			wait_elem('id_name', 'chat_' + chat_with, document, start_chat, ['chat_' + chat_with]);
			show_invite();
		}
	});
}

function show_invite() {
	var win = document.getElementsByClassName('invite_to_chat')[0];
	var cont = win.getElementsByClassName('invite_list')[0];

	cont.innerHTML = '';
	if (win.style.display && win.style.display != 'none') {
		win.style.display = 'none';
		return ;
	}
	$.get('/users/ajax', {action: 'invite_list', room_id: chat_with}, function(res) {
		if (!res.success)
			return ;
		else {
			cont.innerHTML = '';
			for (var i = 0; i < res.data.length; i++) {
				var avatar = res.data[i].avatar ? res.data[i].avatar : '/images/default_avatar.png';
				cont.innerHTML += '<div class="to_invite" id="' + res.data[i].id + '" onclick="add_to_chat(this);">\
					<div class="avatar" style="background-image:url(\'' + avatar + '\');"></div>\
					<h3>' + res.data[i].login + '</h3>\
				</div>';
			}
			win.style.display = 'block';
		}
	});
}

function unread_messages() {
	$.get('/users/ajax', {action: 'get_unread_messages'}, function(res) {
		if (!res.success)
			return ;
		else {
			var list = res.data;
			for (var i = 0; i < list.length; i++) {
				var nb;
				var cont = document.getElementById('chat_' + list[i]['room_id']);
				if (chat_with != list[i]['room_id']) {					
					if (cont && (nb = cont.getElementsByClassName('unread_messages')) && nb.length > 0) {
						nb[0].innerHTML = list[i].total;
						nb[0].style.display = 'flex';
					}
				}
				else if (cont && (nb = cont.getElementsByClassName('unread_messages')) && nb.length > 0)
					nb[0].style.display = 'none';
			}
		}
	});
}

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
		</div>\
		<div class="unread_messages">0</div>\
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

function post_chats(cont_id) {
	var cont = document.getElementById(cont_id);

	cont.innerHTML = '';
	$.get('/users/ajax', {action: 'get_chats'}, function(res) {
		if (!res.success || !res.data)
			return ;
		else
			for (var i = 0; i < res.data.length; i++) {
				fill_chat_list(cont, res.data[i]);
			}
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
	var cont = document.getElementById('chat_messages');
	var add_class = is_owner ? ' owner' : '';
	var avatar = message.avatar ? message.avatar : '/images/default_avatar.png';
	var add_style = is_owner ? ' style="justify-content:flex-end;padding-left:5px;"' : '';

	cont.innerHTML += '<span class="message_time' + add_class + '">' + date_to_display(message.time) + '</span><br>\
		<span class="author_wrapper"' + add_style + '>\
			<div class="avatar" style="background-image:url(\'' + avatar + '\');"></div>\
			<strong class="message_login' + add_class + '">' + message.login + '</strong>\
		</span>\
		<div class="message_wrapper' + add_class + '">\
			<div class="message' + add_class + '">\
				<p class="message_text">' + message.text + '</p>\
			</div>\
		</div>';
}

function post_messages(user_id) {
	var cont = document.getElementById('chat_messages');

	$.post('/users/ajax_post', {action: 'get_messages', room_id: user_id}, function(res) {
		if (!res.success) {
			return ;
		}
		cont.innerHTML = '';
		for (var i = 0; i < res.data.length; i++) {
			post_message(res.data[i], res.data[i].author == current_user.info.id);
		}
		var target = cont.scrollTop + cont.offsetHeight * 42000;
    	$('#chat_messages').animate({scrollTop: target}, 0);
    	$.post('/users/ajax_post', {action: 'update_unread_messages', room_id: chat_with}, function(res) {
			get_unread_messages();
			unread_messages();
		});
	});
}


function start_chat(cont_id) {
	var list = document.getElementsByClassName('chat_user');

	if (Array.isArray(cont_id))
		cont_id = cont_id[0];
	chat_with = cont_id.replace('chat_', '');
	for (var i = 0; i < list.length; i++) {
		var list_id = list[i].id;
		list[i].style['background'] = (list[i].id == cont_id) ? "rgba(200,200,200,0.2)" : 'none';
	}
	unread_messages();
	post_messages(chat_with);
}

function chat_action(user_id) {
	var chat = document.getElementById('chat_window');
	
	chat.style.display = 'block';
	$.get('/users/ajax', {action: 'get_room', user_id: user_id}, function(res) {
		if (!res.success)
			return ;
		else {
			chat_with = res.room_id;
			post_chats('chat_list');
			wait_elem('id_name', 'chat_' + chat_with, document, start_chat, ['chat_' + chat_with]);
		}
	});
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
	var input = document.getElementById('message_input');

	if (!input || input.value.trim() == '' || !chat_with || chat_with == '')
		return ;
	$.post('/users/ajax_post', {action: 'send_message', text: input.value.trim(), room_id: chat_with}, function(res) {
		socket.emit('send_message', {
			room_id: chat_with,
			text: input.value.trim()
		});
		input.value = '';
		if (!res.success) {
			return ;
		}
		post_messages(chat_with);
	});
}

function action(elem_id) {
	var full_size = document.getElementById('friends_window');
	var checked = full_size.querySelector('input:checked');

	if (!checked && (!chat_with || chat_with == '')) {
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
