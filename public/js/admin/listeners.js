function buttons_listeners() {
	var users_button = document.getElementById('users_button');

	users_button.addEventListener('click', function() {
		users_menu();
	});
}

function user_listeners() {
	var del_list = document.getElementsByClassName('del_button');
	var admin_list = document.getElementsByClassName('user_admin');
	var fog = document.getElementById('fog');
	var yes = document.getElementById('yes_button');
	var no = document.getElementById('no_button');
	var text = document.getElementById('confirm_question');

	for (var i = 0; i < del_list.length; i++) {
		del_list[i].addEventListener('click', function() {
			text.innerHTML = 'Do you really want to delete this user?';
			fog.style.display = 'block';
			document.getElementById('action').value = 'del_user';
			document.getElementById('action_data').value = this.id;
			yes.onclick = del_user;
			no.onclick = function() {
				fog.style.display = 'none';
			}
		});
	}

	for (var i = 0; i < admin_list.length; i++) {
		admin_list[i].addEventListener('click', function() {
			text.innerHTML = 'Do you really want to change admin rights for this user?';
			fog.style.display = 'block';
			document.getElementById('action').value = 'change_admin';
			document.getElementById('action_data').value = this.id;
			yes.onclick = change_admin;
			no.onclick = function() {
				fog.style.display = 'none';
				users_menu();
			}
		});
	}
}

function set_listeners() {
	buttons_listeners();
}

set_listeners();