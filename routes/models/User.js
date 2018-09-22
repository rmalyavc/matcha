const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Photo = require('Photo.js');

var UserSchema = new Schema({
	login: {type: String, unique: true, required: true, minlength: 4, maxlength: 50},
	password: {type: String, required: true},
	email: {type: String, required: true, unique: true, maxlength: 50},
	first_name: {type: String, required: false, default: '', maxlength: 50},
	last_name: {type: String, required: false, default: '', maxlength: 50},
	admin: {type: Boolean, default: false},
	active: {type: Boolean, default: true},
	about: {type: String, default: '', required: false, maxlength: 500},
	photo: [{type: Schema.Types.ObjectId, ref: 'Photo'}]
}, {collection: 'users'});

module.exports = mongoose.model('User', UserSchema);
