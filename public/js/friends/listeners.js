function radio_listeners() {
	var cont = document.getElementsByClassName('friends_wrapper')[0];
	var inputs = cont.getElementsByTagName('input');

	for (var i = 0; i < inputs.length; i++) {
		// alert('test');
		inputs[i].addEventListener('click', function() {
			uncheck_users(this.id);
		});
	}
}