const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Photo = require('./Photo.js');
var User = require('./User.js');

var CommentSchema = new Schema({
	author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	photo: {type: Schema.Types.ObjectId, ref: 'Photo', required: true},
	owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	text: {type: String, required: true, maxlength: 255},
	time: {type: Date, default: Date.now}
}, {collection: 'comments'});

module.exports = mongoose.model('Comment', CommentSchema);