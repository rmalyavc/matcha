function check_ownership() {
	var url = window.location.href;
	var page_id = url.substring(url.lastIndexOf('/') + 1);
	var button = document.getElementById('save_changes');
	var del = document.getElementById('del_photo');
	var fields;

	$.get('/users/ajax', {id: page_id, action: 'is_owner'}, function(result) {
		if (result)
			return ;
		fields = document.getElementsByClassName('form_field profile_input');
		for (var i = 0; i < fields.length; i++)
			fields[i].disabled = true;
		if (button)
			button.outerHTML = '';
		del.outerHTML = '';
	});
}

function upload_button() {
	var field = document.getElementById('upload');
	var button = document.getElementById('confirm_upload');

	if (!field || !button)
		return ;
	if (field.value)
		button.style.display = 'unset';
	else
		button.style.display = 'none';
}
