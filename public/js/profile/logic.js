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
	form_data.append('id', user_id.value);
	form_data.append('action', 'upload');
	// form_data.append('processData', false);
	// form_data.append('contentType', false)
	// form_data.append('pictureFile', input.files[0]);

	// $.ajax({
	//   url: 'upload.php',
	//   type: 'POST',
	//   processData: false, // important
	//   contentType: false, // important
	//   dataType : 'json',
	//   data: myFormData
	// });
	// $.post('/users/ajax', form_data, function(result) {
	// 	alert('test');
	// });
	$.ajax({
		url: '/users/ajax_post',
		type: 'POST',
		processData: false, // important
		contentType: false, // important
		// dataType : 'json',
		data: form_data,
		success: function(result) {
			alert('test');
		}
	});
}

function get_all_users() {
	$.get('/users/ajax', {action: 'get_all_users'}, function(result) {
		// alert(result);
		console.log(result);
	});
}