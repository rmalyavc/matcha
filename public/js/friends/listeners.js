function radio_listeners() {
	var cont = document.getElementsByClassName('friends_wrapper')[0];
	var inputs = cont.getElementsByTagName('input');

	for (var i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('click', function() {
			uncheck_users(this.id);
		});
	}
}

function tools_listeners() {
	var tools = document.getElementsByClassName('tool_button');
	var input = document.getElementById('message_input');

	input.addEventListener('keypress', function(event) {
		if (event.keyCode == 13)
			action('send_message');
	});
	for (var i = 0; i < tools.length; i++) {
		tools[i].addEventListener('click', function() {
			action(this.id);
		});
	}
}

function chat_listeners() {
	var close = document.getElementById('close_chat');
	var chat = document.getElementById('chat_window');
	var invite = [document.getElementById('close_invite'), document.getElementById('add_to_chat')];

	for (var i = 0; i < invite.length; i++) {
		invite[i].addEventListener('click', function() {
			show_invite();
		});
	}
	close.addEventListener('click', function() {
		chat.style.display = 'none';
	});
}

function chat_list_listeners() {
	var list = document.getElementsByClassName('chat_user');

	for (var i = 0; i < list.length; i++) {
		list[i].addEventListener('click', function() {
			start_chat(this.id);
		});
	}
}