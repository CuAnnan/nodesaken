let mongoose = require('mongoose'),
    shortid = require('shortid');

let GameSchema = new mongoose.Schema({
    reference:{type:String, default:shortid.generate},
    name:{type:String},
    description:{type:String},
    public:{type:Boolean, default:false},
    serverName:{type: String},
    serverId:{type:String},
    characters:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
    owner:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    support:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}]
});

module.exports = mongoose.model('Game', GameSchema);