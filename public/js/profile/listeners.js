function login_listener() {
	var login = document.getElementById('login');

	if (!login)
		return ;
	login.addEventListener('keyup', function() {
		console.log('Login listener');
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

function scroll_listeners() {
	var prev = document.getElementById('prev');
	var next = document.getElementById('next');

	if (!prev || !next)
		return ;
	prev.addEventListener('click', function() {
		scroll_preview('left');
		// cont.scrollLeft -= 30;
		// console.log(cont.scrollLeft);
	});
	next.addEventListener('click', function() {
		scroll_preview('right');
		// cont.scrollLeft += 30;
		
	});
}

function set_listeners() {
	login_listener();
	email_listener();
	check_ownership();
	file_listeners();
	scroll_listeners();
	post_images();
}

set_listeners();