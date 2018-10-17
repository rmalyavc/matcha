function scroll_preview(offset, timeout, cont_id) {
	var cont = document.getElementById(cont_id);
	var delta = parseInt(document.getElementById('delta').value);
	if (offset === 0)
		offset = cont.offsetWidth;
	else if (offset === -1)
		offset = -cont.offsetWidth;
	else {
		document.getElementById('delta').value = offset;
		offset = (offset - delta) * -1;
	}
	var target = cont.scrollLeft + offset;
    $('#' + cont_id).animate({scrollLeft: target}, timeout);
}

function post_images(cont_id, type) {
	var cont = document.getElementById(cont_id);
	var url = window.location.href;
	var user_id = url.substring(url.lastIndexOf('/') + 1);

	$.get('/users/ajax', {id: user_id, action: 'get_user'}, function(res) {
		if (!res || !res.photo || res.photo.length < 1 || !cont)
			return ;
		cont.innerHTML = '';
		for (var i = 0; i < res.photo.length; i++) {
			cont.innerHTML += '<div class="' + type + '" id="' + res.photo[i]._id + '" style="background-image: url(' +
				"'"  + res.photo[i].url + "'" + ');background-position: center;background-size: 100%;background-repeat: no-repeat;"></div>';
		}
		photo_listeners();
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
			if (res.success === true && res.data.photo && res.data.photo.length > 0) {
				post_images('preview_cont', 'img_wrapper');
			}
		}
		else
			alert('res is empty...');
	}).catch(function(err) {
		alert(err);
	});
	input.value = '';
}

// function draw_full() {
	

	
// 	fog.innerHTML = '';
// 	fog.style.display = 'block';
// 	cont.style.display = 'block';
// }

// function get_url(id) {
// 	var img = document.getElementById(id);
// 	style = img.currentStyle || window.getComputedStyle(img, false);
// 	return (style.backgroundImage.slice(4, -1).replace(/"/g, ""));
// }

function hide_full() {
	document.getElementById('fog').style.display = 'none';
	document.getElementById('full_size').style.display = 'none';
}

function show_photo(elem) {
	var full_photo = document.getElementById('full_photo');
	var photos = document.getElementsByClassName('img_wrapper long');
	var cont = document.getElementById('full_size');
	var fog = document.getElementById('fog');

	if (photos.length < 1) {
		post_images('full_preview', 'img_wrapper long');
		photos = document.getElementsByClassName('img_wrapper long');
		fog.innerHTML = '';
	}
	fog.style.display = 'block';
	cont.style.display = 'block';
	full_photo.style.backgroundImage = elem.style.backgroundImage;
	full_photo.setAttribute('name', elem.id);
}

function change_slide(elem_id) {
	var add = elem_id === 'prev_slide' ? -1 : 1;
	var full = document.getElementById('full_photo');
	var photos = document.getElementsByClassName('img_wrapper long');

	for (var i = 0; i < photos.length; i++) {
		if (photos[i].id == full.getAttribute('name') && i + add >= 0 && i + add < photos.length) {
			console.log('I = ' + i + '\n Add = ' + add);
			full.style.backgroundImage = photos[i + add].style.backgroundImage;
			full_photo.setAttribute('name', photos[i + add].id);
			return ;
		}
	}
}

// function full_screen(id) {
// 	var full = document.getElementById('full_photo');
// 	var minimize = document.getElementById('minimize');

// 	// if (id === 'full_screen') {
// 	// 	full.style
// 	// }
// }
// full_photo.setAttribute('name', elem.id);