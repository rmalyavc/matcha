function uncheck_users(elem_id) {
	var cont = document.getElementsByClassName('friends_wrapper')[0];
	var inputs = cont.getElementsByTagName('input');

	for (var i = 0; i < inputs.length; i++)
		if (inputs[i].id != elem_id)
			inputs[i].checked = false;
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
				<div class="avatar" style="background-image:url(' + "'" + avatar + "'" + '"></div>\
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

function post_friends() {
	var cont = document.getElementsByClassName('friends_wrapper')[0];

	// console.log(document.getElementById('friends_window'));
	cont.innerHTML = '';
	$.get('/users/ajax', {action: 'get_friends'}, function(res) {
		if (!res.success)
			cont.innerHTML = '<h3 class="text_header error_text">' + res.error + '</h3>';
		else if (res.data.length < 1)
			cont.innerHTML = '<h3 class="text_header error_text">No friends found =(</h3>';
		else
			for (var i = 0; i < res.data.length; i++)
				post_friend(cont, res.data[i]);
	});
}

function friends() {
	fog_visible('fog', true, false);
	post_friends();
}
$(document).ready(function() {
	friends();	
});
