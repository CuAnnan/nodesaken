let mongoose = require('mongoose'),
    shortid = require('shortid');

let CharacterAPIKeySchema = new mongoose.Schema({
    reference:{type:String, default:shortid.generate},
    duration:{type:Number},
    createdAtTimestamp:{type:Number, default:Date.now},
    character: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' },
});

CharacterAPIKeySchema.methods.isValid = ()=>{
    return Date.now() - this.createdAtTimestamp
};

module.exports = mongoose.model('CharacterAPIKey', CharacterAPIKeySchema);