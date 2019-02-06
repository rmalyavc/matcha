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
	var sort = document.getElementById('sort_button');

	// search.addEventListener('click', function() {
	// 	find_users();
	// });
	sort.addEventListener('click', function() {
		sort_results(this);
	});
	start.addEventListener('click', function() {
		start_search();
	});
	for (var i = 0; i < closers.length; i++) {
		closers[i].addEventListener('click', function() {
			var arg = this.id == 'back_button' ? 'close_search' : this.id;
			close_search(arg);
		});
	}
}

function set_listeners() {
	slider_listeners();
	search_listeners();
}

set_listeners();