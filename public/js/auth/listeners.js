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

function password_listener() {
	var passwd = document.getElementById('password');
	var again = document.getElementById('password_again');

	if (!passwd || !again)
		return ;
	passwd.addEventListener('keyup', function() {
		valid_password(false);
	});
	again.addEventListener('keyup', function() {
		valid_password(false);
	});
}

function form_listener() {
	var button = document.getElementById('signup');
	if (!button)
		return ;
	button.addEventListener('click', before_submit);
}

function names_listeners() {
	var first_name = document.getElementById('first_name');
	var last_name = document.getElementById('last_name');

	if (!first_name || !last_name)
		return ;
	first_name.addEventListener('keyup', function() {
		valid_name(first_name);
	});
	last_name.addEventListener('keyup', function() {
		valid_name(last_name);
	});
}

function set_listeners() {
	login_listener();
	email_listener();
	password_listener();
	form_listener();
	names_listeners();
}

set_listeners();