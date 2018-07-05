let mongoose = require('mongoose'),
	shortid = require('shortid');

let UserSchema = new mongoose.Schema({
	reference:{type:String, default:shortid.generate},
	email:{type:String,unique:true,required:true,trim:true},
	displayName:{type:String,unique:true,required:true,trim:true},
	passwordHash:{type:String, required:true, trim:true},
	passwordSalt:{type:String, required:true, trim:true},
	created:{type:String, default:Date.now},
	termsGDPR:{type:Boolean, default:false},
	breachGDPR:{type:Boolean, default:false},
	characters:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
	discordUsername:{type:String},
	resetKey:{type:String},
	resetNeeded:{type:Boolean,default:false},
	resetRequested:{type:Date}
});

module.exports = mongoose.model('User', UserSchema);