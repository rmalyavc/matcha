const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
	url: {type: String, required: true},
	avatar: {type: Boolean, default: false}
});

module.exports = mongoose.model('Photo', PhotoSchema);