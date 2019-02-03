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
	find_users();
}

function close_search(button_id) {
	var fog = document.getElementById('fog');
	var wrapper = document.getElementById('index_wrapper');
	var results = document.getElementById('search_results');
	// var form = document.getElementById('index_form');

	results.style.display = 'none';
	// form.style.display = 'block';
	if (button_id == 'close_search') {
		fog.style.display = 'none';
		wrapper.style.display = 'none';
	}
	start_slider();
}

function apply_filters() {
	var cont = document.getElementById('filters_cont');
	var filters;
	var params = {};

	if (cont)
		filters = cont.getElementsByClassName('filter_row'); 
	if (!cont || !filters)
		return ;
	for (var i = 0; i < filters.length; i++) {
		var field = filters[i].id.replace('_filter', '');
		var list = filters[i].getElementsByTagName('input');
		if (list && list.length > 0) {
			for (var j = 0; j < list.length; j++) {
				if (list[j].type == 'checkbox' && list[j].checked) {
					if (!params[field])
						params[field] = [];
					params[field].push(list[j].value);
				}
				else if (list[j].type == 'number' && list[j].value && list[j].value != '') {
					if (!params[field])
						params[field] = {};
					var param = list[j].id.replace(field + '_', '');
					params[field][param] = list[j].value;
				}
				else if (list[j].type == 'text' && list[j].value && list[j].value != '')
					params[field] = list[j].value;
			}
		}
	}
	find_users(params);
}

function clear_filters() {
	var cont = document.getElementById('filters_cont');
	var filters;

	if (cont)
		filters = cont.getElementsByClassName('filter_row'); 
	if (!cont || !filters)
		return ;
	for (var i = 0; i < filters.length; i++) {
		var field = filters[i].id.replace('_filter', '');
		var list = filters[i].getElementsByTagName('input');
		if (list && list.length > 0) {
			for (var j = 0; j < list.length; j++) {
				if (list[j].type == 'checkbox')
					list[j].checked = false;
				else
					list[j].value = '';
			}
		}
	}
}

// <div class="search_result">
// 					<a href="/">
// 						<img class="avatar" src="/images/avatar.png">
// 						<div class="user_info">
// 							<div class="user_info_wrapper">
// 								<label class="admin_label">Login:</label><strong>root</strong><br>
// 								<label class="admin_label">Full Name:</label><strong>Root Rootovich</strong><br>
// 								<label class="admin_label">Age:</label><strong>42</strong><br>
// 								<label class="admin_label" id="about_label">About me:</label>
// 								<div class="search_about">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Excepteur sint occaecat cupidatat non proident oidento</div>
// 							</div>
// 						</div>
// 					</a>
// 				</div>

function post_users(rows) {
	var cont = document.getElementsByClassName('results_cont')[0];

	$('.search_result').remove();
	$('.error_text').remove();
	if (rows.length < 1)
		$(cont).append('<h2 class="text_header error_text">No users found =(</h2>');
	for (var i = 0; i < rows.length; i++) {
		var age = rows[i].age ? rows[i].age : '';
		var avatar = rows[i].avatar ? rows[i].avatar : '/images/avatar.png';
		var about = rows[i].about ? rows[i].about : '';
		var full_name = rows[i].first_name ? rows[i].first_name + ' ' : '';

		if (rows[i].last_name)
			full_name += rows[i].last_name;
		$(cont).append('<div class="search_result">\
			<a href="/users/profile/' + rows[i].id + '">\
				<div class="search_avatar" style="background-image: url(\'' + avatar + '\');"></div>\
				<div class="user_info">\
					<div class="user_info_wrapper">\
						<label class="admin_label">Login:</label><strong>' + rows[i].login + '</strong><br>\
						<label class="admin_label">Full Name:</label><strong>' + full_name + '</strong><br>\
						<label class="admin_label">Age:</label><strong>' + age + '</strong><br>\
						<label class="admin_label about_label">About me:</label>\
						<div class="search_about">' + about + '</div>\
					</div>\
				</div>\
			</a>\
		</div>');
	}
}

function find_users(params = {}) {
	// var form = document.getElementById('index_form');
	// var fields = form.getElementsByClassName('form_field profile_input');
	var results = document.getElementsByClassName('search_results')[0];
	var req = {
		action: 'find_users',
		user_id: user_id
	};
	if (params != {})
		req.params = params;
	// console.log(req);
	// form.style.display = 'none';
	results.style.display = 'block';
	// for (var i = 0; i < fields.length; i++) {
	// 	if (fields[i].value != '')
	// 		req[fields[i].getAttribute('name')] = fields[i].value;
	// }
	$.get('/users/ajax', req, function(res) {
		console.log(res);
		if (!res.success)
			console.log(res.error);
		else
			post_users(res.data);
	});
}

start_slider();