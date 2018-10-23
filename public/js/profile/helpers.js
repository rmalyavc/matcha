function get_authors(comms) {
	var ids = [];

	for (var i = 0; i < comms.length; i++) {
		ids.push(comms[i].author);
	}
	return (ids);
}

function get_elem(_id, list) {
	for (var i = 0; i < list.length; i++) {
		if (list[i]._id == _id)
			return (list[i]);
	}
	return (false);
}

function get_avatar(album) {
	for (var i = 0; i < album.length; i++) {
		if (album[i].avatar)
			return (album[i].url);
	}
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

function get_avatar(album) {
	for (var i = 0; i < album.length; i++) {
		if (album[i].avatar === true)
			return (album[i].url);
	}
	return ('/images/default_avatar.png');
}