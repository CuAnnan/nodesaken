let mongoose = require('mongoose'),
    shortid = require('shortid');

let PackSchema = new mongoose.Schema({
    reference:{type:String, default:shortid.generate},
    name:{type:String},
    playerCharacters:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
    game:{type:mongoose.Schema.Types.ObjectId, ref:'Game'},
    nonPlayerCharacters:[{type:mongoose.Schema.Types.ObjectId, ref:'Character'}]
});

module.exports = PackSchema;