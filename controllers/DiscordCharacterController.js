const   DiscordController = require('./DiscordController'),
        cache = require('objectcache').getInstance(),
        Character= require('../schemas/CharacterSchema');

class DiscordCharacterController extends DiscordController
{
    static async getCharacterByReference(reference, discordUserId)
    {
        let user = await this.getUserByDiscordUserId(discordUserId);
        let character = await this.getCachedCharacter(reference);
        console.log(`"${character.owner}", "${user._id}"`);
        if(character.owner.equals(user._id))
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
    static async getCachedCharacter(reference)
    {
        let toon = cache.get(reference);
        if(toon)
        {
            console.log('Fetching character from cache');
        }
        else
        {
            console.log('Fetching character from database and caching');
            toon = await Character.findOne({reference:reference});
            if(!toon)
            {
                throw new Error('No Character found matching reference');
            }
            cache.put(reference, toon);
        }
        return toon;
    }
}

module.exports = DiscordCharacterController;