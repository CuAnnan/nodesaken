/**
 * This bot extends CoDDieBot with Nodesaken Specific methods
 */

let CoDDieBot = require('./CoDDieBot');

class NSCoDDieBot extends CoDDieBot
{
    constructor()
    {
        super();
        this.checkedOutCharacters = {};
    }

    hoist(client)
    {
        super.hoist(client);
    }

    attachCommands()
    {
        return super.attachCommands();
    }

    simpleRoll(commandParts, message, comments)
    {
        console.log(commandParts);
        return super.simpleRoll(commandParts, message, comments);
    }

    checkCharacterOut(commandParts, message, comments)
    {

    }

    processCommand(message)
    {
        if(message.guild === null)
        {
            if(message.content.startsWith('identify'))
            {
                let reference = message.content.split(' ')[1],
                    UserController = require('../controllers/UserController');
                UserController.bindDiscordUser(reference, message.author).then(
                    ()=>{
                        //user.createDM().then((x)=>{x.send(message);});
                        message.author.createDM().then(
                            (x)=>{
                                x.send('Your account has been registered to this user');
                            }
                        );
                    }
                );
            }
        }
        else
        {
            super.processCommand(message);
        }
    }
}

module.exports = NSCoDDieBot;