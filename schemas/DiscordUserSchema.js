let mongoose = require('mongoose'),
    shortid = require('shortid');

let DiscordUserSchema = new mongoose.Schema({
    reference:{type:String, default:shortid.generate},
    tag:{type:String,required:true,trim:true},
    id:{type:String},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    status:{type:String, enum:['Approved', 'Rejected', 'Pending'], default:'Pending'}
});

DiscordUserSchema.index({user:1, tag:1}, {unique:true});

module.exports = mongoose.model('DiscordUser', DiscordUserSchema);