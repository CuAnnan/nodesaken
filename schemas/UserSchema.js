let mongoose = require('mongoose');
let shortid = require('shortid');
let bcrypt = require('bcrypt');

let UserSchema = new mongoose.Schema({
	_id: {type: String,'default': shortid.generate},
	email:{type:String,unique:true,required:true,trim:true},
	displayName:{type:String,unique:true,required:true,trim:true},
	passwordHash:{type:String, required:true, trim:true},
	passwordSalt:{type:String, required:true, trim:true},
	emailHash:{type:String},
	created:{type:String, default:Date.now},
	confirmed:{type:Boolean, default:false},
	tfaKey:{type:String},
	tfaConfirmed:{type:Boolean, default:false},
});

UserSchema.pre(
	'update',
	function()
	{
		let toHash = this.email+'.'+Date.now();
		return bcrypt.hash(toHash,10).then(
			(hash)=>
			{
				this.emailHash = hash;
			}
		)
	}
);

module.exports = mongoose.model('User', UserSchema);