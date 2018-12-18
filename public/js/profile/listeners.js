function login_listener() {
	var login = document.getElementById('login');

	if (!login)
		return ;
	login.addEventListener('keyup', function() {
		valid_login(false);
	});
}

function email_listener() {
	var email = document.getElementById('email');

	if (!email)
		return ;
	email.addEventListener('keyup', function() {
		valid_email(false);
	});
}

function ownership_listeners() {
	var fields = document.getElementsByClassName('form_field profile_input');

	if (!fields)
		return ;
	for (var i = 0; i < fields.length; i++)
		fields[i].addEventListener('keyup', function() {
			check_ownership();
		});
}

function file_listeners() {
	var field = document.getElementById('upload');
	var button = document.getElementById('confirm_upload');

	if (!field)
		return ;
	field.addEventListener('change', function() {
		upload_button();
	});
	button.addEventListener('click', function() {
		upload_image();
	});
}

function swipe_listener(cont) {
	var mc = new Hammer(cont);
		
	mc.on('panleft panright panend', function(event) {
		if (event.type === 'panend') {
			document.getElementById('delta').value = 0;
			return ;
		}
		scroll_preview(event.deltaX, 0, cont.id);
	});
}

function scroll_listeners() {
	var prev = document.getElementById('prev');
	var next = document.getElementById('next');
	var conts = document.getElementsByClassName('preview_wrapper');
	var close = document.getElementById('close_full');
	var prev_next = document.getElementsByClassName('prev_next slider_button');

	prev.addEventListener('click', function() {
		scroll_preview(-1, 500, 'preview_cont');
	});
	next.addEventListener('click', function() {
		scroll_preview(0, 500, 'preview_cont');
	});
	for (var i = 0; i < conts.length; i++) {
		swipe_listener(conts[i]);
	}
	close.addEventListener('click', function() {
		fog.getElementsByClassName('confirm_window')[0].style.display = 'block';
		hide_full();
	});
	for (var i = 0; i < prev_next.length; i++) {
		prev_next[i].addEventListener('click', function() {
			change_slide(this.id);
		});
	}
}

function photo_listeners() {
	var photos = document.getElementsByClassName('img_wrapper');

	for (var i = 0; i < photos.length; i++) {
		photos[i].addEventListener('click', function() {
			show_photo(this);
		});
	}
}

function comment_listeners() {
	var input = document.getElementById('comment_input');

	input.addEventListener('keypress', function(event) {
		if (event.keyCode == 13 && input.value != '') {
			add_comment();
			input.value = '';
		}
	});
}

function avatar_listener() {
	var avatar = document.getElementById('profile_avatar');
	var url = window.location.href;
	var user_id = url.substring(url.lastIndexOf('/') + 1);
	var close = document.getElementById('close_avatar');
	var choose_win = document.getElementById('choose_avatar');

	close.addEventListener('click', function() {
		choose_win.style.display = 'none';
	});
	$.get('/users/ajax', {action: 'is_owner', id: user_id}, function(res) {
		if (res) {
			avatar.addEventListener('click', function() {
				choose_avatar();
			});
		}
	});
}

function avatar_list_listeners() {
	var list = document.getElementsByClassName('avatar_list');

	for (var i = 0; i < list.length; i++) {
		list[i].addEventListener('click', function() {
			set_avatar(this.id);
		});
	}
}

function like_listeners() {
	var like = document.getElementById('like_button');

	like.addEventListener('click', function() {
		like_photo();
	});
	like.addEventListener('mouseover', function(event) {
		like_hover(event, this);
	});
	like.addEventListener('mouseleave', function(event) {
		like_hover(event, this);
	});
}

function del_listener() {
	var del = document.getElementById('del_photo');

	if (!del)
		return ;
	del.addEventListener('click', function() {
		del_photo();
	});
}

function friends_listeners() {
	var tools = document.getElementById('profile_form').getElementsByClassName('tool_button');

	check_friendship();
	if (!tools || tools.length < 1)
		return ;
	for (var i = 0; i < tools.length; i++) {
		tools[i].addEventListener('click', function() {
			friends(this.id);
		});
	}
}

function hashtags_listeners() {
	var input = document.getElementById('new_hashtag');
	var button = document.getElementById('add_hashtag');

	button.addEventListener('click', function() {
		if (input.value != '')
			add_hashtag();
	});
	input.addEventListener('keypress', function(event) {
		if (event.keyCode == 13 && input.value != '')
			add_hashtag();
	});
}
// function full_screen_listeners() {
// 	var buttons = document.getElementsByClassName('full_screen');

// 	for (var i = 0; i < buttons.length; i++) {
// 		buttons[i].addEventListener('click', function() {
// 			full_screen(this.id);
// 		});
// 	}
// }

function set_listeners() {
	login_listener();
	email_listener();
	check_ownership();
	file_listeners();
	scroll_listeners();
	comment_listeners();
	avatar_listener();
	draw_avatar();
	like_listeners();
	del_listener();
	friends_listeners();
	hashtags_listeners();
	post_images('preview_cont', 'img_wrapper');
	post_tags();
}

set_listeners();