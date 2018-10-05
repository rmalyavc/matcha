function buttons_listeners() {
	var users_button = document.getElementById('users_button');

	users_button.addEventListener('click', function() {
		users_menu();
	});
}

function set_listeners() {
	buttons_listeners();
}

set_listeners();