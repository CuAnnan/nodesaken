let mongoose = require('mongoose'),
	shortid = require('shortid'),
CharacterSchema = new mongoose.Schema({
	json:Object,
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	name: {type: String},
	auspice:{type: String},
	tribe: {type: String},
	reference:{type:String, default:shortid.generate},
	apiKeys:[{ type: mongoose.Schema.Types.ObjectId, ref: 'CharacterAPIKey' }],
});

module.exports = mongoose.model('Character', CharacterSchema);