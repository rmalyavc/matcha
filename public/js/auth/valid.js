function paint_field(field, res) {
	var col = 'unset';
	res === false ? col = 'rgba(255,0,0,0.5)' : true;
	field.style['background-color'] = col;
}

function display_error(error, res) {
	if (res)
		error.style.display = 'none';
	else
		error.style.display = 'block';
} 

function valid_password(submit) {
	var passwd = document.getElementById('password');
	var again = document.getElementById('password_again');
	var error = document.getElementById('password_error');

	error.innerHTML = 'Passwords should match';
	var res = true;

	if ((!passwd || !again) && (res = false)) {
		error.innerHTML = 'Something went wrong';
	}
	else if ((passwd.value.length < 8 && (passwd.value.length > 0 || submit)) ||
		(again.value.length < 8 && (again.value.length > 0 || submit))) {
		res = false;
		error.innerHTML = 'Password should be at least 8 symbols length';
	}
	else if (passwd.value !== again.value &&
		((passwd.value !== '' && again.value !== '') || submit))
		res = false;
	if (res) {
		paint_field(passwd, true);
		paint_field(again, true);
	}	
	display_error(error, res);
	return (res);
}

function is_email(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function valid_email(submit) {
	var email = document.getElementById('email');
	var error = document.getElementById('email_error');
	var res = true;

	error.innerHTML = 'Invalid email';
	if (!email || !error)
		return (false);
	if (!is_email(email.value) && (email.value !== '' ||
		(submit && (error.innerHTML = 'This field is required'))))
		res = false;
	if (email.value !== '') {
		$.get('/users/ajax', {email: email.value, action: 'is_unique'}, function(result) {
			if (!result && (error.innerHTML = 'This email is already used')) {
				paint_field(email, false);
				display_error(error, false);
			}
		});
	}
	if (res)
		paint_field(email, true);
	display_error(error, res);
	return (res);
}

function valid_login(submit) {
	var login = document.getElementById('login');
	var error = document.getElementById('login_error');
	var res = true;

	error.innerHTML = 'User already exists';
	if (!login || !error)
		return (false);
	if ((login.value === '' && submit) || (login.value !== '' && login.value.length < 4)) {
		error.innerHTML = login.value === '' ? 'This field is required' : 'Login should be at least 4 characters';
		res = false;
	}
	if (login.value !== '') {
		$.get('/users/ajax', {login: login.value, action: 'is_unique'}, function(result) {
			if (!result && (error.innerHTML = 'User already exists')) {
				paint_field(login, false);
				display_error(error, false);
			}
		});
	}
	if (res)
		paint_field(login, res);
	display_error(error, res);
	return (res);
}

function valid_name(elem) {
	if (!elem) {
		alert('Unable to find the field to valid. Please try to refresh the page');
		return false;
	}
	var error = document.getElementById(elem.id + '_error');
	if (!error) {
		return false;
	}
	if (!elem.value || elem.value.trim() == '') {
		error.innerHTML = 'This field is required';
		display_error(error, false);
		return false;
	}
	else if (elem.value.trim().length < 4) {
		var field_name = elem.id == 'first_name' ? 'First Name ' : 'Last Name ';
		error.innerHTML = field_name + 'should be at least 4 symbols length';
		display_error(error, false);
		return false;
	}
	paint_field(elem, true);
	display_error(error, true);
	return true;
}

function before_submit() {
	var form = document.getElementsByClassName('login_form')[0];
	var login = document.getElementById('login');
	var passwd = document.getElementById('password');
	var again = document.getElementById('password_again');
	var email = document.getElementById('email');
	var first_name = document.getElementById('first_name');
	var last_name = document.getElementById('last_name');

	if (!form)
		alert('Form to submit is not found. Please, try to refresh the page');
	else if (!valid_login(true)) {
		paint_field(login, false);
		alert('Invalid login');
	}
	else if (!valid_password(true)) {
		paint_field(passwd, false);
		paint_field(again, false);
		alert('Invalid password');
	}
	else if (!valid_email(true)) {
		paint_field(email, false);
		alert('Invalid email');
	}
	else if (!valid_name(first_name)) {
		paint_field(first_name, false);
	}
	else if (!valid_name(last_name)) {
		paint_field(last_name, false);
	}
	else if (form.checkValidity() && current_user.location) {
		document.getElementById('latitude').value = current_user.location['latitude'];
		document.getElementById('longitude').value = current_user.location['longitude'];
		document.getElementById('approved').value = current_user.location['approved'];
		$.get('https://maps.googleapis.com/maps/api/geocode/json', {
			latlng: current_user.location['latitude'] + ',' + current_user.location['longitude'],
			key: 'AIzaSyBUANppGueYbxwGaR3-Fxbos3_uxYnG3OY'
		}, function(res) {
			document.getElementById('city').value = get_city(res);
			form.submit();
		});
	}
}