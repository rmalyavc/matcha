function start_listener() {
	var start = document.getElementById('start_button');

	start.addEventListener('click', function() {
		start_search();
	});
}

function slider_listeners() {
	var buttons = document.getElementsByClassName('prev_next');

	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', function() {
			change_slide(this);
		});
	}
}

function search_listeners() {
	var close = document.getElementById('close_search');

	if (!close)
		return ;
	close.addEventListener('click', function() {
		close_search();
	});
}

function set_listeners() {
	start_listener();
	slider_listeners();
	search_listeners();
}

set_listeners();