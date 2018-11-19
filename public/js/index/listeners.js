function slider_listeners() {
	var buttons = document.getElementsByClassName('prev_next');

	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', function() {
			change_slide(this);
		});
	}
}

function search_listeners() {
	var start = document.getElementById('start_button');
	var search = document.getElementById('search_button');
	var closers = document.getElementsByClassName('close_button');

	if (!close)
		return ;
	search.addEventListener('click', function() {
		find_users();
	});
	start.addEventListener('click', function() {
		start_search();
	});
	for (var i = 0; i < closers.length; i++) {
		closers[i].addEventListener('click', function() {
			close_search(this.id);
		});
	}
}

function set_listeners() {
	slider_listeners();
	search_listeners();
}

set_listeners();