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

function set_listeners() {
	login_listener();
	email_listener();
	check_ownership();
}

set_listeners();