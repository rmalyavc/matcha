function fog_visible(fog_id, show_fog, show_conf, show_res = false) {
	var fog = document.getElementById(fog_id);

	if (!fog) {
		return ;
	}
	var conf = fog.getElementsByClassName('confirm_window');
	if (conf && conf.length > 0)
		conf[0].style.display = show_conf ? 'block' : 'none';
	var conf_res = fog.getElementsByClassName('confirm_result');
	if (conf_res && conf_res.length > 0) {
		conf_res[0].style.display = show_res ? 'block' : 'none';
	}
	fog.style.display = show_fog ? 'block' : 'none';
}

function wait_elem(type, name, parent, callback, args = [], tries = 100) {
	var needle;
	var elem;
	var counter = 0;
	var handler = {
		'id_name': function() {
			needle = document.getElementById(name);
			return (needle != null);
		},
		'class_name': function() {
			needle = parent.getElementsByClassName(name);
			return (needle != null && needle.length > 0);
		},
		'tag_name': function() {
			needle = parent.getElementsByTagName(name);
			return (needle != null && needle.length > 0);
		}
	};

	if (!type || !name || type == '' || name == '' || !parent || !callback) {
		return (true);
	}
	var interval_id = setInterval(function() {
		if (counter > tries) {
			if (callback)
				callback(args);
		}
		if (handler[type]()) {
			clearInterval(interval_id);
			callback(args);
		}
		counter++;
	}, 100);
}

function distance(lat1, lon1, lat2, lon2, unit = "K") {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

function date_to_display(str) {
	var date = new Date(str);

	return date.toLocaleString();
}

function get_city(data) {
	if (!data || !data['results'] || data['results'].length < 1 || !data['results'][0]['address_components'] || data['results'][0]['address_components'].length < 1)
		return '';
	var results = data['results'][0]['address_components'];

	for (var i = 0; i < results.length; i++) {
		var types = results[i]['types'];
		if (types.indexOf('locality') !== -1)
			return results[i]['short_name'];
	}
	return '';
}

function location_by_city(data) {
	if (!data || !data['results'] || data['results'].length < 1 || !data['results'][0]['geometry'] || !data['results'][0]['geometry']['location'] || !data['results'][0]['geometry']['location']['lat'] || !data['results'][0]['geometry']['location']['lng'])
		return null;
	return {
		latitude: data['results'][0]['geometry']['location']['lat'],
		longitude: data['results'][0]['geometry']['location']['lng']
	};
}
