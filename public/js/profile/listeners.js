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
	// full_screen_listeners();
	post_images('preview_cont', 'img_wrapper');
}

set_listeners();