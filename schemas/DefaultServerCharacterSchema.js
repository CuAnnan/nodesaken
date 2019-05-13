/**
 * We need to store a default character persistently so as to allow the cache to pull it automatically when the cache expires.
 */
let Mongoose = require('mongoose'),
    DefaultServerCharacterSchema = new Mongoose.Schema({
        discordUserId:{type:String},
        guildId:{type:String},
        characterReference: {type: String},
    });
DefaultServerCharacterSchema.index(
    {discordUserId:1, guildId:1},
    {unique:true}
);

module.exports = Mongoose.model('DefaultServerCharacter', DefaultServerCharacterSchema);