function requets_listeners() {
	button = document.getElementById('requests_button');
	cont = document.getElementById('requests_cont');

	if (!button || !cont)
		return ;
	button.addEventListener('click', function() {
		cont.style.display = (cont.style.display == 'none' || !cont.style.display) ? 'block' : 'none';
	});
}

function set_listeners() {
	requets_listeners();
}

$(document).ready(function() {
	get_location();

	get_requests();
	get_unread_messages();
	update_history();
});
