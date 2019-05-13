const   DiscordController = require('./DiscordController'),
        cache = require('objectcache').getInstance(),
        DefaultServerCharacter = require('../schemas/DefaultServerCharacterSchema'),
        CharacterSchema= require('../schemas/CharacterSchema'),
        ForsakenCharacter = require('../characterModel/Forsaken/ForsakenCharacter');

class DiscordCharacterController extends DiscordController
{
    static async setCharacterReferenceByGuildAndUserId(reference, discordUserId, guildId)
    {
        let defaultCharacter = {
            discordUserId:discordUserId,
            guildId:guildId,
            characterReference:reference
        };
        await DefaultServerCharacter.findOneAndUpdate(defaultCharacter, defaultCharacter, {upsert:true});
    }

    static async getDefaultCharacter(discordUserId, guildId)
    {
        let character = cache.get(discordUserId);
        if(character)
        {
            return character;
        }

        console.log('No cached character found, checking for default character');

        let defaultCharacterEntity = await DefaultServerCharacter.findOne({discordUserId:discordUserId, guildId:guildId});
        if(!defaultCharacterEntity)
        {
            console.log('No default character found, not sure what to do about that');
            return null;
        }
        let toon = await this.cacheCharacterByReference(defaultCharacterEntity.characterReference, discordUserId, guildId);
        return toon;
    }

    static async cacheCharacterByReference(reference, discordUserId, guildId)
    {
        let user = await this.getUserByDiscordUserId(discordUserId);
        let character = await this.getCachedCharacter(reference, discordUserId, guildId);

        if(character.owner._id.equals(user._id))
        {
            return character;
        }

        return null;
    }

    /**
     * Get a character from the cache. If it isn't in the cache, get it from the database and put it in the cache
     * @param reference
     * @returns {Promise<void>}
     */
    static async getCachedCharacter(reference, discordUserId, guildId)
    {
        let toon = cache.get(discordUserId);
        if(toon)
        {
            console.log('Fetching character from cache');
        }
        else
        {
            console.log('Fetching character from database and caching');
            let toonData = await CharacterSchema.findOne({reference:reference});
            if(!toonData)
            {
                throw new Error('No Character found matching reference '+reference);
            }
            toon = ForsakenCharacter.fromJSON(toonData);
            await this.setCharacterReferenceByGuildAndUserId(reference, discordUserId, guildId);
            cache.put(discordUserId, toon);
        }
        return toon;
    }
}

module.exports = DiscordCharacterController;