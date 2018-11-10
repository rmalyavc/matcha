var interval_id = '';
var slides = 5;
var slide = 0;
var link = document.getElementById('profile_link');
var user_id = link ? link.href.substring(link.href.lastIndexOf('/') + 1) : false;

function start_slider() {
	var img = document.getElementsByClassName('slider_photo')[0];

	interval_id = setInterval(function() {
		slide = slide < slides ? slide + 1 : 1;
		img.src = '/images/slider' + slide + '.jpg';
	}, 5000);
}

function change_slide(button) {
	var add = button.id == 'prev' ? -1 : 1;
	var img = document.getElementsByClassName('slider_photo')[0];

	if (slide + add < 1)
		return ;
	slide = slide + add > slides ? 1 : slide + add;
	clearInterval(interval_id);
	img.src = '/images/slider' + slide + '.jpg';
	start_slider();
}

function start_search() {
	var fog = document.getElementById('fog');
	var wrapper = document.getElementById('index_wrapper');

	if (user_id === false)
		window.location.href = '/users/login';
	clearInterval(interval_id);
	fog.innerHTML = '';
	fog.style.display = 'block';
	wrapper.style.display = 'flex';
}

function close_search() {
	var fog = document.getElementById('fog');
	var wrapper = document.getElementById('index_wrapper');

	fog.style.display = 'none';
	wrapper.style.display = 'none';

	start_slider();
}

start_slider();