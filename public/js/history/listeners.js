function history_listeners() {
	var cont = document.getElementById('history_cont');

	if (!cont)
		return ;
	var buttons = cont.getElementsByClassName('submit_button');
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', function() {
			get_history(this.id);
		});
	}
}

$(document).ready(function() {
	history_listeners();
	get_history('by_you');
})