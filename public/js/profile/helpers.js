function get_last_seen(db_date) {
	var date1 = new Date();
	var date2 = new Date(db_date);
	var unit = ' minute';
	var diff = parseInt((date1 - date2) / 1000 / 60);
	console.log('diff is: ' + diff);

	if (diff >= 60 * 24) {
		diff = parseInt(diff / 60 / 24);
		unit = ' day';
	}
	else if (diff > 59) {
		diff = parseInt(diff / 60);
		unit = ' hour';
	}
	if (diff != 1)
		unit += 's';
	return 'Last seen: ' + diff + unit + ' ago';
}

function get_authors(comms) {
	var ids = [];

	for (var i = 0; i < comms.length; i++) {
		ids.push(comms[i].author);
	}
	return (ids);
}

function get_user_ids(users) {
	var list = [];

	for (var i = 0; i < users.length; i++) {
		list.push(users[i].id);
	}
	return (list);
}

function get_elem(_id, list) {
	for (var i = 0; i < list.length; i++) {
		if (list[i].id == _id)
			return (list[i]);
	}
	return (false);
}

function get_avatar(user_id) {
	// $.get('/users/ajax', {action: 'get_avatar', user_id: user_id}, function(res) {
	// 	if (res.success)
	// });
	// for (var i = 0; i < album.length; i++) {
	// 	if (album[i].avatar)
	// 		return (album[i].url);
	// }
	return ('/images/avatar.png');
}

function up_to_date() {
	var full = document.getElementById('full_preview');
	var mini = document.getElementById('preview_cont');

	if (!full || !mini)
		return (false);
	var full_list = full.getElementsByClassName('img_wrapper long');
	var mini_list = mini.getElementsByClassName('img_wrapper');
	return (full_list != null && mini_list != null && full_list.length === mini_list.length);
}

// function get_avatar(album) {
// 	for (var i = 0; i < album.length; i++) {
// 		if (album[i].avatar === true)
// 			return (album[i].url);
// 	}
// 	return ('/images/default_avatar.png');
// }