var url = window.location.href;
var user_id = url.substring(url.lastIndexOf('/') + 1);

function scroll_preview(offset, timeout, cont_id) {
	var cont = document.getElementById(cont_id);
	var delta = parseInt(document.getElementById('delta').value);
	if (offset === 0)
		offset = cont.offsetWidth;
	else if (offset === -1)
		offset = -cont.offsetWidth;
	else {
		document.getElementById('delta').value = offset;
		offset = (offset - delta) * -1;
	}
	var target = cont.scrollLeft + offset;
    $('#' + cont_id).animate({scrollLeft: target}, timeout);
}

function post_images(cont_id, type) {
	var cont = document.getElementById(cont_id);

	$.post('/users/ajax_post', {user_id: user_id, action: 'get_album'}, function(res) {
		if (!res.success || res.album.length < 1)
			return ;
		cont.innerHTML = '';
		for (var i = 0; i < res.album.length; i++) {
			cont.innerHTML += '<div class="' + type + '" id="' + res.album[i].id + '" style="background-image: url(' +
				"'"  + res.album[i].url + "'" + ');background-position: center;background-size: 100%;background-repeat: no-repeat;"></div>';
		}
		photo_listeners();
	}).catch(function(err) {
		console.log(err);
	});
}

function upload_image() {
	var input = document.getElementById('upload');
	var form_data = new FormData();

	if (!input || !user_id) {
		console.log('Input\'s not found');
		return ;
	}
	form_data.append('file', $('#upload')[0].files[0]);
	form_data.append('action', 'upload_photo');
	form_data.append('user_id', user_id);
	$.ajax({
		url: '/users/ajax_post',
		type: 'POST',
		processData: false,
		contentType: false,
		dataType : 'json',
		data: form_data,
	}).done(function(res) {
		if (res) {
			alert('Done!');
			if (res.success === true) {
				post_images('preview_cont', 'img_wrapper');
			}
		}
		else
			alert('res is empty...');
	}).catch(function(err) {
		console.log(err);
	});
	input.value = '';
}

function hide_full() {
	document.getElementById('fog').style.display = 'none';
	document.getElementById('full_size').style.display = 'none';
}

function show_photo(elem) {
	var full_photo = document.getElementById('full_photo');
	var photos = document.getElementsByClassName('img_wrapper long');
	var cont = document.getElementById('full_size');
	var fog = document.getElementById('fog');

	console.log('Up to date is: ' + up_to_date());
	if (!up_to_date()) {
		post_images('full_preview', 'img_wrapper long');
		photos = document.getElementsByClassName('img_wrapper long');
		fog.getElementsByClassName('confirm_window')[0].style.display = 'none';
		// fog.innerHTML = '';
	}
	fog.style.display = 'block';
	cont.style.display = 'block';
	full_photo.style.backgroundImage = elem.style.backgroundImage;
	full_photo.setAttribute('name', elem.id);
	comments();
	draw_likes();
}

function change_slide(elem_id) {
	var add = elem_id === 'prev_slide' ? -1 : 1;
	var full = document.getElementById('full_photo');
	var photos = document.getElementsByClassName('img_wrapper long');

	for (var i = 0; i < photos.length; i++) {
		if (photos[i].id == full.getAttribute('name')) {
			if (i + add < 0 || i + add >= photos.length)
				return (false);
			else {
				console.log('I = ' + i + '\n Add = ' + add);
				full.style.backgroundImage = photos[i + add].style.backgroundImage;
				full_photo.setAttribute('name', photos[i + add].id);
				comments();
				return (true);
			}
		}
	}
}

function draw_comment(comment, author) {
	var cont = document.getElementById('comment_list');

	var date = new Date(comment.time);
	$.get('/users/ajax', {action: 'get_avatar', user_id: author.id}, function(res) {
		var avatar = res.success ? res.data : '/images/avatar.png';
		cont.innerHTML += '<div class="comment">' +
			'<div class="avatar" id="avatar" style="background-image: url(' + "'" + avatar + "'" +
			');background-position: center;background-size: 100%;background-repeat: no-repeat;"></div>' +
			'<div class="comment_wrapper">' +
				'<div>' +
					'<p class="comment_author">' + author.login + '</p>' +
					'<p class="comment_text">' + comment.text + '</p>' +
					'<p class="comment_time">' + date.toLocaleString(); + '</p>' +
				'</div>' +
			'</div>' +
		'</div>';
	}).catch(function(err) {
		console.log(err);
	});
	// cont.innerHTML += '<div class="comment">' +
	// 	'<div class="avatar" id="avatar" style="background-image: url(' + "'" + get_avatar(author.id) + "'" +
	// 	');background-position: center;background-size: 100%;background-repeat: no-repeat;"></div>' +
	// 	'<div class="comment_wrapper">' +
	// 		'<div>' +
	// 			'<p class="comment_author">' + author.login + '</p>' +
	// 			'<p class="comment_text">' + comment.text + '</p>' +
	// 			'<p class="comment_time">' + date.toLocaleString(); + '</p>' +
	// 		'</div>' +
	// 	'</div>' +
	// '</div>';
}


function draw_comments(comms) {
	$.post('/users/ajax_post', {action: 'get_users', authors: get_authors(comms)}, function(res) {
		if (!res.success)
			console.log(res.error);
		else {
			
			for (var i = 0; i < comms.length; i++) {
				draw_comment(comms[i], get_elem(comms[i].author, res.data));
			}
		}
	});
}

function comments() {
	var photo_id = document.getElementById('full_photo').getAttribute('name');

	document.getElementById('comment_list').innerHTML = '';
	$.get('/users/ajax', {photo_id: photo_id, action: 'get_comments'}, function(res) {
		if (res.success && res.data && res.data.length > 0)
			draw_comments(res.data);
		else if (res.error)
			console.log(res.error);
	}).catch(function(err) {
		console.log(err);
	});
}

function add_comment() {
	var photo = document.getElementById('full_photo');
	var input = document.getElementById('comment_input');

	if (!input || !photo || input.value == '')
		return ;
	$.get('/users/ajax', {
		photo_id: photo.getAttribute('name'),
		owner_id: user_id,
		text: input.value,
		action: 'add_comment'
	}, function(res) {
		if (!res.success)
			console.log(res.error);
		else
			comments();
	}).catch(function(err) {
		console.log(err);
	});
}

function choose_avatar() {
	var cont = document.getElementById('choose_avatar');

	post_images('choose_avatar_wrapper', 'avatar_list');
	cont.style.display = 'block';
	var interval_id = setInterval(function() {
		if (document.getElementsByClassName('avatar_list').length > 0) {
			avatar_list_listeners();
			clearInterval(interval_id);
		}
	}, 100);
}

function set_avatar(elem_id) {
	var fog = document.getElementById('avatar_fog');
	var yes = document.getElementById('yes_avatar');
	var no = document.getElementById('no_avatar');
	var cont = document.getElementById('choose_avatar');

	document.getElementById('confirm_question').innerHTML = 'Do you really want to choose this photo?';
	fog.style.display = 'block';
	no.addEventListener('click', function() {
		fog.style.display = 'none';
	});
	yes.onclick = function() {
		$.get('/users/ajax', {action: 'set_avatar', user_id: user_id, photo_id: elem_id}, function(res) {
			console.log(res);
			if (!res.success) {
				console.log(res.error);
				return ;
			}
			fog.style.display = 'none';
			cont.style.display = 'none';
			draw_avatar();
		}).catch(function(err) {
			console.log(err);
		});
	};
}

function draw_avatar() {
	var avatar = document.getElementById('profile_avatar');

	$.get('/users/ajax', {action: 'get_avatar', user_id: user_id}, function(res) {
		var user_avatar = res.success ? res.data : '/images/avatar.png';
		// console.log(res);
		// if (!res) {
		// 	console.log('Cannot get user');
		// 	return;
		// }
		avatar.src = user_avatar;
	});
}

function draw_likes() {
	var photo = document.getElementById('full_photo');
	var button = document.getElementById('like_button');
	var qty = document.getElementById('like_qty');

	console.log('Draw Likes!');
	$.get('/users/ajax', {action: 'get_likes', photo_id: photo.getAttribute('name'), user_id: user_id}, function(res) {
		console.log(res);
		if (!res.success) {
			console.log(res.error);
			return ;
		}
		qty.innerHTML = res.qty;
		button.setAttribute('liked', res.liked);
		button.style['background'] = res.liked ? 'linear-gradient(0deg, #ff3232, #CD2421)' : 'none';
	}).catch(function(err) {
		console.log(err);
	});
}

function like_photo() {
	var photo = document.getElementById('full_photo');
	var button = document.getElementById('like_button');

	$.get('/users/ajax', {action: 'like_photo', photo_id: photo.getAttribute('name'), user_id: user_id}, function(res) {
		console.log(res);
		if (!res.success)
			console.log(res.error);
		draw_likes();
	}).catch(function(err) {
		console.log(err);
	});
}

function del_photo() {
	var photo = document.getElementById('full_photo');
	var fog = document.getElementById('del_fog');
	var yes = document.getElementById('yes_del');
	var no = document.getElementById('no_del');

	alert('Del Photo');
	fog.style.display = 'block';
	no.onclick = function() {
		fog.style.display = 'none';
	}
	yes.onclick = function() {
		$.post('/users/ajax_post', {action: 'del_photo', photo_id: photo.getAttribute('name'), user_id: user_id}, function(res) {
			console.log(res);
			if (!res.success)
				console.log(res.error);
			else if (!change_slide('next_slide'))
				change_slide('prev_slide');
			post_images('preview_cont', 'img_wrapper');
			post_images('full_preview', 'img_wrapper long');
		}).catch(function(err) {
			console.log(err);
		});
		fog.style.display = 'none';
	}
}

function like_hover(event, button) {
	if (button.getAttribute('liked') === 'true')
		return ;
	button.style['background'] = event.type === 'mouseover' ? 'linear-gradient(0deg, #ff3232, #CD2421)' : 'none';
}