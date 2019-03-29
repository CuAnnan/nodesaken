let mongoose = require('mongoose'),
    shortid = require('shortid');

let DiscordUserSchema = new mongoose.Schema({
    reference:{type:String, default:shortid.generate},
    username:{type:String,required:true,trim:true},
    id:{type:String},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    confirmed:{type:String, enum:['Approved', 'Rejected', 'Pending'], default:'Pending'}
});

module.exports = mongoose.model('DiscordUser', DiscordUserSchema);