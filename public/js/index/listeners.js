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
	var close = document.getElementById('close_search');

	if (!close)
		return ;
	search.addEventListener('click', function() {
		find_users();
	});
	close.addEventListener('click', function() {
		close_search();
	});
	start.addEventListener('click', function() {
		start_search();
	});
}

function set_listeners() {
	slider_listeners();
	search_listeners();
}

set_listeners();