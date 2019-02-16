function post_history(rows) {
	var result_cont = document.getElementById('history_results');
	var buff = '';

	if (!result_cont || !rows)
		return ;
	$('.search_result').remove();
	for (var i = 0; i < rows.length; i++) {
		var avatar = rows[i].avatar ? rows[i].avatar : '/images/avatar.png';
		buff += '<div class="search_result">\
					<a href="/users/profile/' + rows[i].id + '">\
						<div class="search_avatar" style="background-image: url(\'' + avatar + '\');"></div>\
						<div class="user_info">\
							<div class="user_info_wrapper">\
								<label class="admin_label">Login:</label><strong>' + rows[i].login + '</strong><br>\
								<label class="admin_label">Date:</label><strong>' + rows[i].time + '</strong><br>\
							</div>\
						</div>\
					</a>\
				</div>';
	}
	$('#history_results').append(buff);
}

function get_history(button_id) {
	var cont = document.getElementById('history_cont');
	var result_cont = document.getElementById('history_results');

	if (!cont || !result_cont || !button_id)
		return ;
	var buttons = cont.getElementsByClassName('submit_button');

	$.get('/users/ajax', {action: 'get_visits', button_id: button_id}, function(res) {
		if (!res.success)
			result_cont.innerHTML = '<h3 class="text_header error_text">' + res.error + '</h3>';
		else {
			for (var i = 0; i < buttons.length; i++) {
				var text = buttons[i].getElementsByTagName('strong')[0];
				text.style['color'] = buttons[i].id == button_id ? 'white' : 'black';
				buttons[i].style['background'] = null;
				buttons[i].style['background'] = buttons[i].id == button_id ? 'linear-gradient(180deg, #6F9C1B, #8CC13D);' : 'none';
			}
			post_history(res.data);
		}
	});
}