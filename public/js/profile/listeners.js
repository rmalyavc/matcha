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

function set_listeners() {
	login_listener();
	email_listener();
}

set_listeners();