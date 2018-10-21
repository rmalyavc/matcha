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
	var url = window.location.href;
	var user_id = url.substring(url.lastIndexOf('/') + 1);

	$.get('/users/ajax', {id: user_id, action: 'get_user'}, function(res) {
		if (!res || !res.photo || res.photo.length < 1 || !cont)
			return ;
		cont.innerHTML = '';
		for (var i = 0; i < res.photo.length; i++) {
			cont.innerHTML += '<div class="' + type + '" id="' + res.photo[i]._id + '" style="background-image: url(' +
				"'"  + res.photo[i].url + "'" + ');background-position: center;background-size: 100%;background-repeat: no-repeat;"></div>';
		}
		photo_listeners();
	}).catch(function(err) {
		console.log(err);
	});
}

function upload_image() {
	var input = document.getElementById('upload');
	var user_id = document.getElementById('user_id');
	var form_data = new FormData();

	if (!input || !user_id) {
		console.log('Input\'s not found');
		return ;
	}
	form_data.append('file', $('#upload')[0].files[0]);
	form_data.append('action', 'upload_photo');
	form_data.append('user_id', user_id.value);
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
			if (res.success === true && res.data.photo && res.data.photo.length > 0) {
				post_images('preview_cont', 'img_wrapper');
			}
		}
		else
			alert('res is empty...');
	}).catch(function(err) {
		alert(err);
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
		fog.innerHTML = '';
	}
	fog.style.display = 'block';
	cont.style.display = 'block';
	full_photo.style.backgroundImage = elem.style.backgroundImage;
	full_photo.setAttribute('name', elem.id);
	comments();
}

function change_slide(elem_id) {
	var add = elem_id === 'prev_slide' ? -1 : 1;
	var full = document.getElementById('full_photo');
	var photos = document.getElementsByClassName('img_wrapper long');

	for (var i = 0; i < photos.length; i++) {
		if (photos[i].id == full.getAttribute('name') && i + add >= 0 && i + add < photos.length) {
			console.log('I = ' + i + '\n Add = ' + add);
			full.style.backgroundImage = photos[i + add].style.backgroundImage;
			full_photo.setAttribute('name', photos[i + add].id);
			comments();
			return ;
		}
	}
}


// $.post('/users/ajax_post', {action: action.value, id: user_id.value}, function(res) {
// 		if (!res.success)
// 			window.location = '/error?error=' + err + '&image=/images/error';
// 		else {
// 			console.log(res);
// 			users_menu();
// 		}
// 	}).catch(function(err) {
// 		window.location = '/error?error=' + err + '&image=/images/error';
// 	});

function draw_comment(comment, author) {
	var cont = document.getElementById('comment_list');

	var date = new Date(comment.time);
	cont.innerHTML += '<div class="comment">' +
		'<div class="avatar" id="avatar" style="background-image: url(' + "'" + get_avatar(author.photo) + "'" +
		');background-position: center;background-size: 100%;background-repeat: no-repeat;"></div>' +
		'<div class="comment_wrapper">' +
			'<div>' +
				'<p class="comment_author">' + author.login + '</p>' +
				'<p class="comment_text">' + comment.text + '</p>' +
				'<p class="comment_time">' + date.toLocaleString(); + '</p>' +
			'</div>' +
		'</div>' +
	'</div>';
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
	var url = window.location.href;
	var user_id = url.substring(url.lastIndexOf('/') + 1);
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
	console.log(document.getElementsByClassName('avatar_list'));
	avatar_list_listeners();
	// set_avatar(elem);
}

function set_avatar(elem) {
	var fog = document.getElementById('avatar_fog');
	var yes = document.getElementById('yes_avatar');
	var no = document.getElementById('no_avatar');
	var cont = document.getElementById('choose_avatar');
	var url = window.location.href;
	var user_id = url.substring(url.lastIndexOf('/') + 1);

	no.addEventListener('click', function() {
		fog.style.display = 'none';
	});
	yes.addEventListener('click', function() {
		$.get('/users/ajax', {action: set_avatar, user_id: user_id, photo_id: elem.id}, function(res) {
			if (!res.success) {
				console.log(res.error);
				return ;
			}
			fog.style.display = 'none';
			cont.style.display = 'none';
		});
	});
}