const   Controller = require('./Controller'),
        DiscordUser = require('../schemas/DiscordUserSchema');

class DiscordController extends Controller
{
    static async getUserByDiscordUserId(discordUserId)
    {
        let discordUser = await DiscordUser.findOne({id:discordUserId}).populate('user');
        return discordUser.user;
    }

    static async getUserByDiscordUser(discordUser)
    {
        return this.getUserByDiscordUserId(discordUser.id);
    }

    static async getUserByDiscordMessage(discordMessage)
    {
        return this.getUserByDiscordUser(discordMessage.author);
    }
}
module.exports = DiscordController;