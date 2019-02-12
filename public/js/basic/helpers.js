function fog_visible(fog_id, show_fog, show_conf, show_res = false) {
	var fog = document.getElementById(fog_id);
	// console.log('Fog is:');
	// console.log(fog);
	// console.log()

	if (!fog) {
		console.log('Fog is not found');
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
			console.log('Class' + needle);
			return (needle != null && needle.length > 0);
		},
		'tag_name': function() {
			needle = parent.getElementsByTagName(name);
			console.log(needle);
			return (needle != null && needle.length > 0);
		}
	};

	if (!type || !name || type == '' || name == '' || !parent || !callback) {
		console.log("Wait Elem:\nError! Type = " + type + " Name = " + name + "Callback is: " + callback);
		return (true);
	}
	var interval_id = setInterval(function() {
		if (counter > tries) {
			console.log("Wait Elem!\nError: Unable to find element\nType = " + type + " Name = " + name);
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
