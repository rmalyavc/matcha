function check_ownership() {
	var url = window.location.href;
	var page_id = parseInt(url.substring(url.lastIndexOf('/') + 1));
	var button = document.getElementById('save_changes');
	var del = document.getElementById('del_photo');
	var new_tag_cont = document.getElementById('new_tag_cont');
	var fields;

	$.get('/users/ajax', {id: page_id, action: 'is_owner'}, function(result) {
		console.log('RESULT IS: ' + result);
		console.log('PAGE ID IS: ' + page_id);
		if (result)
			return ;
		fields = document.getElementsByClassName('form_field profile_input');
		for (var i = 0; i < fields.length; i++)
			fields[i].disabled = true;
		if (button)
			button.outerHTML = '';
		if (new_tag_cont)
			new_tag_cont.outerHTML = '';
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

function is_hashtag(tag) {
	var re = /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/;
	var restricted = [",", "'", '"', '`', '~', '^', '/', "\\", '{', '}', '[', ']', '(', ')', ' ', "\t", "\n", "\r", "*", "|", "%", "$", "=", "+", "@", "1", "<", ">", ";", ":", ".", "§", "±", "№"];
	if (!re.test(String(tag).toLowerCase()) || tag.lastIndexOf("#") != 0)
		return (false);
	for (var i = 0; i < restricted.length; i++) {
		if (tag.lastIndexOf(restricted[i]) != -1)
			return (false);
	}
	return (true);
}

function check_tag() {
	var input = document.getElementById('new_hashtag');
	var button = document.getElementById('add_hashtag');
	var error = document.getElementById('hashtags').getElementsByClassName('error_text')[0];

	if (!input || !button || !error)
		return ;
	if (!is_hashtag(input.value)) {
		button.disabled = true;
		error.style.display = input.value != '' ? 'block' : 'none';
		return ;
	}
	error.style.display = 'none';
	button.disabled = false;
}
