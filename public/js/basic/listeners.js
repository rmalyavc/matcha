function requets_listeners() {
	button = document.getElementById('requests_button');
	cont = document.getElementById('requests_cont');

	if (!button || !cont)
		return ;
	console.log([button, cont]);
	button.addEventListener('click', function() {
		console.log('Trigger worked!');
		cont.style.display = (cont.style.display == 'none' || !cont.style.display) ? 'block' : 'none';
	});
}

function requests_visible() {
	button = document.getElementById('requests_button');
	cont = document.getElementById('requests_cont');

	if (!button || !cont)
		return ;
	cont.style.display = (cont.style.display == 'none' || !cont.style.display) ? 'block' : 'none';
}

function set_listeners() {
	requets_listeners();
}

$(document).ready(function() {
	// set_listeners();
	get_location();

	get_requests();
});
