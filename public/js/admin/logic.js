function get_user_ids(users) {
	var list = [];

	for (var i = 0; i < users.length; i++) {
		list.push(users[i].id);
	}
	return (list);
}

function get_elem(_id, list) {
	for (var i = 0; i < list.length; i++) {
		if (list[i].user_id == _id)
			return (list[i].url);
	}
	return (false);
}

function get_avatar(album) {
	for (var i = 0; i < album.length; i++) {
		if (album[i].avatar === true)
			return (album[i].url);
	}
	return ('/images/default_avatar.png');
}

function proceed() {
	var fog = document.getElementById('fog');
	var action = document.getElementById('action');
	var user_id = document.getElementById('action_data');

	if (!fog || !action || !user_id || action.value == '' || user_id.value == '') {
		fog.style.display = 'none';
		users_menu();
		return ;
	}
	$.post('/users/ajax_post', {action: action.value, id: user_id.value}, function(res) {
		if (!res.success)
			window.location = '/error?error=' + res.error + '&image=/images/error';
		else
			users_menu();
	}).catch(function(err) {
		window.location = '/error?error=' + err + '&image=/images/error';
	});
	fog.style.display = 'none';
}

function post_users(cont, users) {
	$.post('/users/ajax_post', {action: 'get_avatars', list: get_user_ids(users)}, function(res) {
		if (!res.success) {
			return ;
		}
		for (var i = 0; i < users.length; i++) {
			var admin = users[i].admin ? 'checked' : '';
			var active = users[i].active ? 'checked' : '';
			var avatar = get_elem(users[i].id, res.data) ? get_elem(users[i].id, res.data) : '/images/avatar.png';
			var full_name = users[i].first_name ? users[i].first_name : '';
			full_name += users[i].last_name ? ' ' + users[i].last_name : '';

			cont.innerHTML += '<div class="user_cont">' +
				'<div class="avatar_wrapper">' +
					'<img class="avatar" src="' + avatar + '">' +
				'</div>' +
				'<div class="user_info">' +
					'<div class="user_info_wrapper">' +
						'<label class="admin_label">Login:</label><strong>' + users[i].login + '</strong><br>' +
						'<label class="admin_label">Full Name:</label><strong>' + full_name + '</strong><br>' +
						'<label class="admin_label">Email:</label><strong>' + users[i].email + '</strong>' +
					'</div>' +
				'</div>' +
				'<div class="user_tools">' +
					'<div class="tool">' +
						'<input type="checkbox" id="' + users[i].id + '" class="user_active" ' + active + '>' +
						'<strong>Active</strong>' +
					'</div>' +
					'<div class="tool">' +
						'<input type="checkbox" id="' + users[i].id + '" class="user_admin" ' + admin + '>' +
						'<strong>Admin</strong>' +
					'</div>' +
					'<div class="tool">' +
						'<button type="button" class="del_button" id="' + users[i]._id + '"><img class="tool_image" src="/images/delete.png"><strong>Delete</strong></button>' +
					'</div>' +
				'</div>' +
			'</div>';
		}
		user_listeners();
	});
}

function users_menu() {
	var cont = document.getElementById('admin_content');
	var button = document.getElementById('users_button');

	if (!cont || !button)
		return ;
	cont.innerHTML = '';
	$.get('/users/ajax', {action: 'get_all_users'}, function(result) {
		if (!result.success)
			cont.innerHTML = result.error;
		else {
			button.style['background'] = 'linear-gradient(180deg, #6F9C1B, #8CC13D)';
			post_users(cont, result.users);
		}
	});
}