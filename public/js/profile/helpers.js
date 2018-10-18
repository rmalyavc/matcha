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