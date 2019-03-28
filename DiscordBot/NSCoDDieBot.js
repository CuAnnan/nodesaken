/**
 * This bot extends CoDDieBot with Nodesaken Specific methods
 */

let CoDDieBot = require('./CoDDieBot');

class NSCoDDieBot extends CoDDieBot
{
    constructor()
    {
        super();
    }


    attachCommands()
    {
        return super.attachCommands();
    }
}

module.exports = NSCoDDieBot;