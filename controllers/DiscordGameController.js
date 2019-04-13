const   DiscordController   = require('./DiscordController'),
        Game                = require('../schemas/GameSchema');

class DiscordGameController extends DiscordController
{
    static async linkGameServer(gameReference, message)
    {
        let discordGuild = message.guild,
            user = await this.getUserByDiscordMessage(message),
            game = await Game.findOne({reference:gameReference}).populate('owner'),
            approved = false;
        if(game.owner._id.equals(user._id))
        {
            approved = true;
        }
        else
        {
            game.populate('support');
            for(let u of game.support)
            {
                if(u._id.equals(user._id))
                {
                    approved = true;
                }
            }
        }
        if(!approved)
        {
            throw new Error('User attempting to update game they do not have privilege on');
        }
        game.serverId = discordGuild.id;
        game.serverName = discordGuild.name;
        await game.save();
        return true;
    }
}

module.exports = DiscordGameController;