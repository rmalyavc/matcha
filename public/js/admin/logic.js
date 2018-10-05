function get_avatar(album) {
	for (var i = 0; i < album.length; i++) {
		if (album[i].avatar === true)
			return (album[i].url);
	}
	return ('/images/default_avatar.png');
}

function post_users(cont, users) {
	for (var i = 0; i < users.length; i++) {
		cont.innerHTML += '<div class="user_cont">' +
			'<div class="avatar_wrapper">' +
				'<img class="avatar" src="' + get_avatar(users[i].photo) + '">' + 
			'</div>' +
			'<div class="user_info">' +
				'<label class="admin_label">Login:</label><strong class="user_info">' + users[i].login + '</strong><br>' +
				'<label class="admin_label">Full Name:</label><strong class="user_info">' + users[i].first_name + ' ' + users[i].last_name + '<strong><br>' +
				'<label class="admin_label">Email:</label><strong class="user_info">' + users[i].email + '</strong>' +
			'</div>' +
			'<div class="user_tools">' +
				'<input type="checkbox" id="' + users[i]._id + '" class="user_active" checked="' + users[i].active + '">' +
			'</div>' +
		'</div>';
	}
}

function users_menu() {
	var cont = document.getElementById('admin_content');

	if (!cont)
		return ;
	cont.innerHTML = '';
	$.get('/users/ajax', {action: 'get_all_users'}, function(result) {
		if (!result.success)
			cont.innerHTML = result.error;
		else {
			post_users(cont, result.users);
		}
	});
}