const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LikeSchema = new Schema({
	photo_id: {type: Schema.Types.ObjectId, ref: 'Photo', required: true},
	owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
});

module.exports = mongoose.model('Like', LikeSchema);