'use strict';
const DiscordBot = require('./DiscordBot.js');

class CoDDieBot extends DiscordBot
{
    async hoist(client)
    {
        await super.hoist(client);
        this.listen();
    }

    attachCommands()
    {
        super.attachCommands();

    }
}

module.exports = new CoDDieBot();