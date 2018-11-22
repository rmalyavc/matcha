function req_confirm(elem, user_id) {
	var action = elem.getAttribute('class') == 'req_tool req_refuse' ? 'refuse_friend' : 'confirm_friend';

	$.get('/users/ajax', {action: action, user_id: user_id}, function(res) {
		if (!res.success)
			console.log(res.error);
		else
			get_requests();
	});
}

function post_request(req) {
	console.log(req);

	var cont = document.getElementById('requests_cont');
	if (!cont)
		return ;
	var avatar = req.avatar ? req.avatar : '/images/default_avatar.png';
	cont.innerHTML += '<div class="request">\
		<div class="req_avatar" style="background-image: url(' + "'" + avatar + "'" + ')"></div>\
		<div class="req_info">\
			<a href="/users/profile/' + req.id + '">' + req.login + '</a><span>\ invites you to be friends</span>\
			<div class="req_tools">\
				<img class="req_tool req_confirm" onclick="req_confirm(this, ' + "'" + req.id + "'" + ');" src="/images/confirm.png">\
				<img class="req_tool req_refuse" onclick="req_confirm(this, ' + "'" + req.id + "'" + ');" src="/images/refuse.png">\
			</div>\
		</div>\
	</div>'
}
// background-image: url(' +
				// "'"  + res.album[i].url + "'" + ');
function post_requests(data) {
	var button = document.getElementById('requests_button');
	var cont = document.getElementById('requests_cont');
	var qty = document.getElementById('req_qty');
	
	if (!button || !qty || !cont || !data)
		return ;
	qty.innerHTML = data.length;
	cont.innerHTML = '';
	for (var i = 0; i < data.length; i++) {
		post_request(data[i]);
	}
}

function get_requests() {
	$.get('/users/ajax', {action: 'get_requests'}, function(res) {
		console.log(res);
		if (!res.success)
			console.log(res.error);
		else if (res.data)
			post_requests(res.data);
	});
}
