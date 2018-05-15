let mongoose = require('mongoose');
let shortid = require('shortid');
let bcrypt = require('bcrypt');

let UserSchema = new mongoose.Schema({
	reference: {type: String,'default': shortid.generate},
	email:{type:String,unique:true,required:true,trim:true},
	displayName:{type:String,unique:true,required:true,trim:true},
	passwordHash:{type:String, required:true, trim:true},
	passwordSalt:{type:String, required:true, trim:true},
	emailHash:{type:String},
	created:{type:String, default:Date.now},
	termsGDPR:{type:Boolean, deafult:false},
	breachGDPR:{type:Boolean, deafult:false},
	characters:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
	discordUsername:{type:String}
});

function generateEmailHash()
{
	let toHash = this.email+'.'+Date.now();
	return bcrypt.hash(toHash,10).then(
		(hash)=>
		{
			this.emailHash = hash;
		}
	)
}

UserSchema.pre('save',generateEmailHash);
UserSchema.pre('update',generateEmailHash);

module.exports = mongoose.model('User', UserSchema);