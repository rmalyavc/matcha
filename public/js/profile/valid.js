function check_ownership() {
	var url = window.location.href;
	var page_id = url.substring(url.lastIndexOf('/') + 1);
	var button = document.getElementById('save_changes');
	var fields;

	$.get('/users/ajax', {id: page_id, action: 'is_owner'}, function(result) {
		if (result)
			return ;
		fields = document.getElementsByClassName('form_field profile_input');
		for (var i = 0; i < fields.length; i++)
			fields[i].disabled = true;
		if (button)
			button.outerHTML = '';
	});
}