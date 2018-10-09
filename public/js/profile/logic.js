function scroll_preview(direction) {
	var cont = document.getElementById('preview_cont');
	var offset;

	if (!cont || !(offset = cont.offsetWidth))
		return ;
	console.log(offset);
	console.log(direction);
	var target = direction === 'right' ? cont.scrollLeft + offset : cont.scrollLeft - offset;
	// cont.scrollLeft = target;
	console.log(target);
	console.log(cont.scrollLeft);
	if (direction === 'right')
		for (var i = cont.scrollLeft; i < target; i++) {
			// console.log(i);
			cont.scrollLeft += 100;
			console.log(cont.scrollLeft);
		}
	else if (direction === 'left')
		for (var i = cont.scrollLeft; i > target; i--) {
			cont.scrollLeft -= 100;
			console.log(cont.scrollLeft);
		}

	// cont.scrollLeft += direction == 'right' ? offset : -offset;
}

function post_images() {
	var container = document.getElementById('preview_cont');
	var url = window.location.href;
	var user_id = url.substring(url.lastIndexOf('/') + 1);

	console.log(url);
	console.log(user_id);

	$.get('/users/ajax', {id: user_id, action: 'get_user'}, function(res) {
		if (!res || !res.photo || res.photo.length < 1 || !container)
			return ;
		container.innerHTML = '';
		for (var i = 0; i < res.photo.length; i++) {
			container.innerHTML += '<img class="preview_img" src="' + res.photo[i].url + '">';
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
				post_images();
			}
		}
		else
			alert('res is empty...');
	}).catch(function(err) {
		alert(err);
	});
	input.value = '';
}
