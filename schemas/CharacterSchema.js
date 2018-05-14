let mongoose = require('mongoose');
let shortid = require('shortid');

let CharacterSchema = new mongoose.Schema({
	json:Object,
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	name: {type: String},
	auspice:{type: String},
	tribe: {type: String},
	reference:{type:String, default:shortid.generate}
});

module.exports = mongoose.model('Character', CharacterSchema);