function fog_visible(fog_id, show_fog, show_conf) {
	var fog = document.getElementById(fog_id);

	if (!fog) {
		console.log('Fog is not found');
		return ;
	}
	var conf = fog.getElementsByClassName('confirm_window');
	if (conf && conf.length > 0)
		conf[0].style.display = show_conf ? 'block' : 'none';
	fog.style.display = show_fog ? 'block' : 'none';
}