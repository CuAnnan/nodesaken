const   Controller = require('./Controller'),
        DiscordUser = require('../schemas/DiscordUserSchema');

class DiscordController extends Controller
{
    static async getUserByDiscordUserId(discordUserId)
    {
        let discordUser = await DiscordUser.findOne({id:discordUserId}).populate('user');
        return discordUser.user;
    }
}
module.exports = DiscordController;