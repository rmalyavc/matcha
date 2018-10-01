function upload_image() {
	var input = document.getElementById('upload');
	var user_id = document.getElementById('user_id');
	var form_data = new FormData();

	if (!input || !user_id) {
		console.log('Input\'s not found');
		return ;
	}
	console.log( $('#upload'));
	form_data.append('file', $('#upload')[0].files[0]);
	form_data.append('action', 'upload_photo');
	form_data.append('user_id', user_id.value);
	$.ajax({
		url: '/users/ajax_post',
		type: 'POST',
		processData: false,
		contentType: false,
		dataType : 'json',
		data: form_data,
	}).done(function(res) {
		if (res) {
			alert('Done!');
			console.log(res);
		}
		else
			alert('res is empty...');
	});
}

function get_all_users() {
	$.get('/users/ajax', {action: 'get_all_users'}, function(result) {
		// alert(result);
		console.log(result);
	});
}