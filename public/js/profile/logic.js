var url = window.location.href;
var user_id = parseInt(url.substring(url.lastIndexOf('/') + 1));

check_blocked();

function update_fame_rating() {
	var rating = document.getElementById('fame_rating');

	if (!rating)
		return ;
	$.get('/users/ajax', {action: 'get_rating', user_id: user_id}, function(res) {
		if (!res.success)
			console.log(res.error);
		else {
			var class_name = (parseInt(res.data)) < 0 ? 'error_text' : 'green';
			rating.setAttribute('class', class_name);
			rating.innerHTML = res.data;
		}
	});
}

function update_user_status() {
	var status = document.getElementById('user_status');
	var cont = document.getElementById('status_cont');
	var last_seen = document.getElementById('last_seen');

	if (current_user['info']['id'] == user_id) {
		cont.style.display = 'none';
		return ;
	}
	$.get('/users/ajax', {action: 'get_user', id: user_id}, function(res) {
		if (!res)
			console.log('User is not found');
		else {
			status.src = res.connected ? '/images/confirm.png' : '/images/close.png';
			status.setAttribute('class', res.connected ? 'tool_button connected' : 'tool_button disconnected');
			last_seen.innerHTML = res.connected ? 'Online' : get_last_seen(res.last_seen);
			cont.style.display = 'flex';
		}
	});
}

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
			// alert('Done!');
			if (res.success === true)
				post_images('preview_cont', 'img_wrapper');
			else
				alert(res.error);
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
		// console.log(res);
		if (!res.success)
			console.log(res.error);
		var points = button.getAttribute('liked') == 'true' ? -1 : 1;
		update_rating(user_id, points);
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

function add_del_friend() {
	var fog = document.getElementById('fog');
	var confirm = fog.getElementsByClassName('confirm_window')[0];
	var res_window = document.getElementsByClassName('confirm_result')[0];
	var text = res_window.getElementsByClassName('text_header')[0];
	var action = document.getElementById('action');
	var tmp = action.value;

	document.getElementById('confirm_close').addEventListener('click', function() {
		confirm.style.display = 'block';
		res_window.style.display = 'none';
		fog.style.display = 'none';
	});
	$.get('/users/ajax', {action: action.value, user_id: user_id}, function(res) {
		confirm.style.display = 'none';
		res_window.style.display = 'block';
		if (!res.success) {
			text.setAttribute('class', 'text_header error_text');
			text.innerHTML = res.error;
		}
		else {
			var points = tmp == 'add_friend' ? 10 : -10;
			update_rating(user_id, points);
			text.setAttribute('class', 'text_header green');
			text.innerHTML = res.text;
			if (tmp == 'add_friend') {
				socket.emit('friend_request', {
					user_id: user_id
				});
			}
			else {
				$.post('/users/ajax_post', {action: 'insert_history', owner: user_id, type: 'remove', confirm: 0}, function(res) {
					if (!res.success)
						console.log(res.error);
					else {
						socket.emit('history_request', {
							user_id: user_id
						});
					}
				});
			}
		}
	}).catch(function(err) {
		confirm.style.display = 'none';
		res_window.style.display = 'block';
		text.setAttribute('class', 'text_header error_text');
		text.innerHTML = err;
	});
	check_friendship();
}

function block_user() {
	var fog = document.getElementById('fog');
	var confirm = fog.getElementsByClassName('confirm_window')[0];
	var res_window = document.getElementsByClassName('confirm_result')[0];
	var text = res_window.getElementsByClassName('text_header')[0];

	document.getElementById('confirm_close').addEventListener('click', function() {
		confirm.style.display = 'block';
		res_window.style.display = 'none';
		fog.style.display = 'none';
	});
	$.post('/users/ajax_post', {action: 'block_user', user_id: user_id}, function(res) {
		confirm.style.display = 'none';
		res_window.style.display = 'block';
		if (!res.success) {
			text.setAttribute('class', 'text_header error_text');
			text.innerHTML = res.error;
		}
		else {
			$.get('/users/ajax', {action: 'del_friend', user_id: user_id}, function(res) {
				if (!res.success) {
					text.setAttribute('class', 'text_header error_text');
					text.innerHTML = res.error;
				}
				else {
					update_rating(user_id, -15);
					text.setAttribute('class', 'text_header green');
					text.innerHTML = 'User has been blocked';
					$.post('/users/ajax_post', {action: 'insert_history', owner: user_id, type: 'block', confirm: 0}, function(res) {
						if (!res.success)
							console.log(res.error);
						else {
							socket.emit('history_request', {
								user_id: user_id
							});
						}
					});
				}
			});			
		}
	});
	check_blocked();
}

function friends(button_id) {
	var fog = document.getElementById('fog');
	var text = fog.getElementsByClassName('text_header')[0];
	var yes = document.getElementById('yes_button');
	var no = document.getElementById('no_button');
	var question = document.getElementById('confirm_question');

	fog.style.display = 'block';
	if (button_id == 'add_friend') {
		// text.innerHTML = 'Send invitation?';
		yes.onclick = add_del_friend;
		no.onclick = function() {
			fog.style.display = 'none';
		}
	}
	else if (button_id == 'block_user') {
		question.innerHTML = 'Do you really want to block this user?';
		yes.onclick = block_user;
		no.onclick = function() {
			fog.style.display = 'none';
		}
	}
}

function check_friendship() {
	var fog = document.getElementById('fog');
	var text = fog.getElementsByClassName('text_header')[0];
	var button = document.getElementById('add_friend');
	var action = document.getElementById('action');

	if (!button || !text || !fog || !action)
		return ;
	$.get('/users/ajax', {action: 'is_friend', user_id: user_id}, function(res) {
		if (!res) {
			button.src = '/images/add_friend.png';
			button.style['border-radius'] = '50%';
			text.innerHTML = 'Send Invitation?';
			action.value = 'add_friend';
		}
		else {
			button.style['border-radius'] = '5px';
			button.src = '/images/delete.png';
			text.innerHTML = 'Do you really want to delete this user?';
			action.value = 'del_friend';
		}
	});
}

function check_blocked() {
	$.get('/users/ajax', {action: 'is_blocked', user_id: user_id}, function(res) {
		if (!res.success)
			console.log(res.error);
		else if (res.blocked) {
			document.getElementById('profile_form').getElementsByClassName('tools_wrapper')[0].innerHTML = '<h3 class="error_text">' + res.response + '</h3>';
		}
	});
}

function post_tags() {
	var cont = document.getElementById('tag_list');
	// var sep = '';

	$.get('/users/ajax', {action: 'get_tags', user_id: user_id}, function(res) {
		if (!res.success)
			console.log(res.error);
		else {
			cont.innerHTML = '';
			var onclick = res.is_owner ? 'onclick="del_hashtag(this);"' : 'onclick="copy_hashtag(this);"';
			for (var i = 0; i < res.data.length; i++) {
				// if (i > 0)
				// 	sep = ',';
				cont.innerHTML += '<a href="#" id="' + res.data[i]['id'] + '"' + onclick + '>' + res.data[i]['name'] + '</a>'; 
			}
		}
	});
}

function add_hashtag() {
	var input = document.getElementById('new_hashtag');
	var button = document.getElementById('add_hashtag');

	if (!input || !button || !input.value || input.value == '')
		return ;
	$.get('/users/ajax', {action: 'add_hashtag', text: input.value, user_id: user_id}, function(res) {
		if (!res.success)
			console.log(res.error);
		else {
			input.value = '';
			post_tags();
		}
	});
	// alert('Test!');
}

function del_hashtag(elem) {
	var fog = document.getElementById('fog');
	var conf = fog.getElementsByClassName('confirm_window')[0];
	var quest = document.getElementById('confirm_question');
	var yes = document.getElementById('yes_button');
	var no = document.getElementById('no_button');

	if (!fog || !conf || !quest || !yes || !no)
		return ;
	quest.innerHTML = 'Do You really want to delete this hashtag?';
	fog.style.display = 'block';
	no.onclick = function() {
		fog.style.display = 'none';
	};
	yes.onclick = function() {
		$.post('/users/ajax_post', {action: 'del_hashtag', tag_id: elem.id}, function(res) {
			if (!res.success)
				console.log(res.error);
			else
				post_tags();
		});
		fog.style.display = 'none';
	};
	// console.log(elem);
}

function copy_hashtag(elem) {
	var quest = document.getElementById('confirm_question');
	var yes = document.getElementById('yes_button');
	var no = document.getElementById('no_button');
	var conf = document.getElementById('fog').getElementsByClassName('confirm_result')[0];
	var conf_text = conf.getElementsByClassName('text_header')[0];
	var button = document.getElementById('confirm_close');

	fog_visible('fog', true, true);
	quest.innerHTML = 'Do you want to copy ' + elem.innerHTML + ' tag?';
	no.onclick = function() {
		fog_visible('fog', true, true);
	}
	yes.onclick = function() {
		$.get('/users/ajax', {action: 'copy_hashtag', tag_id: elem.id, tag_name: elem.innerHTML}, function(res) {
			conf_text.innerHTML = res.success ? res.text : res.error;
			var new_class = res.success ? 'text_header green' : 'text_header error_text';
			conf_text.setAttribute('class', new_class);
			fog_visible('fog', true, false, true);
			button.onclick = function() {
				fog_visible('fog', false, true);
			}
		});
	}
}

function update_visit() {
	if (current_user['info']['id'] != user_id) {
		$.post('/users/ajax_post', {action: 'insert_history', owner: user_id, type: 'visit', confirm: 0}, function(res) {
			if (!res.success)
				console.log(res.error);
			else {
				socket.emit('history_request', {
					user_id: user_id
				});
			}
		});
	}
}