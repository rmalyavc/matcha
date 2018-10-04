// function get_images(id_list) {

// }

function post_images(id_list) {
	var container = document.getElementById('preview_cont');

	console.log('POST IMAGES ENTERED!');
	console.log(id_list);
	console.log(container);
	if (!container)
		return ;
	container.innerHTML = '';
	$.post('/users/ajax_post', {
		action: 'get_images',
		id_list: id_list
	}, function (res, err) {

	// }).done(function(res) {
		console.log(res);
		if (err || !res || res.success === false || !res['images'] || res['images'].length < 1)
			return ;
		for (var i = 0; i < res['images'].length; i++) {
			container.innerHTML += '<img class="preview_img" src="' + res['images'][i].url + '">';
		}
	}).catch(function(err) {
		console.log(err);
	});
}

function upload_image() {
	var input = document.getElementById('upload');
	var user_id = document.getElementById('user_id');
	var form_data = new FormData();

	if (!input || !user_id) {
		console.log('Input\'s not found');
		return ;
	}
	// console.log( $('#upload'));
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
			if (res.success === true && res.data.photo && res.data.photo.length > 0) {
				alert('test!');
				post_images(res.data.photo);
			}
		}
		else
			alert('res is empty...');
	}).catch(function(err) {
		alert(err);
	});
}

function get_all_users() {
	$.get('/users/ajax', {action: 'get_all_users'}, function(result) {
		// alert(result);
		console.log(result);
	});
}