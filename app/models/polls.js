

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var Poll = new Schema({
	name: String,
	options: Array,
	options_votes: Array,
	owner_id: String

})

module.exports = mongoose.model('Poll', User)