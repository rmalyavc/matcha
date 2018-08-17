function paint_field(field, res) {
	var col = 'unset';
	res === false ? col = 'rgba(255,0,0,0.6)' : true;
	field.style['background-color'] = col;
}

function display_error(error, res) {
	if (res)
		error.style.display = 'none';
	else
		error.style.display = 'block';
} 

function valid_password() {
	var passwd = document.getElementById('password');
	var again = document.getElementById('password_again');
	var error = document.getElementById('password_error');
	var msg = 'Passwords should match';
	var res = true;

	if ((!passwd || !again) && (res = false))
		msg = 'Something went wrong';
	else if (passwd.value.length < 8 || again.value.length < 8) {
		res = false;
		msg = 'Password should be at least 8 symbols length';
	}
	else if (passwd.value !== again.value)
		res = false;
	paint_field(passwd, res);
	paint_field(again, res);
	display_error(error, res);
	return (res);
}

function before_submit() {
	alert('test!');
	if (!valid_password())
		return (false);
	return (true);
}
function form_listener() {
	var form = document.getElementsByClassName('login_form')[0];
	console.log(form);
	if (!form)
		return ;
	form.addEventListener('submit', before_submit);
}