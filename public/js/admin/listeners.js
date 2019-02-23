function buttons_listeners() {
	var users_button = document.getElementById('users_button');

	users_button.addEventListener('click', function() {
		users_menu();
	});
}

function user_listener(message, action, list) {
	var fog = document.getElementById('fog');
	var yes = document.getElementById('yes_button');
	var no = document.getElementById('no_button');
	var text = document.getElementById('confirm_question');

	for (var i = 0; i < list.length; i++) {
		list[i].addEventListener('click', function() {
			text.innerHTML = message;
			fog.style.display = 'block';
			document.getElementById('action').value = action;
			document.getElementById('action_data').value = this.id;
			yes.onclick = proceed;
			no.onclick = function() {
				fog.style.display = 'none';
			}
		});
	}
}

function user_listeners() {
	var del_list = document.getElementsByClassName('del_button');
	var admin_list = document.getElementsByClassName('user_admin');
	var active_list = document.getElementsByClassName('user_active');

	user_listener('Do you really want to delete this user?', 'del_user', del_list);
	user_listener('Do you really want to change admin rights for this user?', 'change_admin', admin_list);
	user_listener('Do you really want to deactivate this user?', 'change_active', active_list);
}

function set_listeners() {
	buttons_listeners();
}

set_listeners();