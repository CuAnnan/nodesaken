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
        return super.hoist(client);
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

    addDiscordUserRequest(message)
    {
        let reference = message.content.split(' ')[1],
            DiscordUserController = require('../controllers/DiscordUserController');

        DiscordUserController.addDiscordUserRequest(reference, message.author).then(
            ()=>{
                //user.createDM().then((x)=>{x.send(message);});
                this.sendDM(message.author, 'You will need to sign into your Nodesaken account page to finalise connecting your two accounts.');
            }
        ).catch(
            (error)=>{
                switch(error.name)
                {
                    case "MongoError":
                        if(error.code === 11000)
                        {
                            this.sendDM(message.author, 'This user has already been added to that account.');
                        }
                        else
                        {
                            this.sendDM(message.author, 'An unexpected Mongoose error has occured. This has been logged.');
                        }
                        break;
                    default:
                        this.sendDM(message.author, 'An unexpected Application error has occured. This has been logged.');
                        break;
                }
            }
        );
    }

    processCommand(message)
    {
        if(message.guild === null)
        {
            if(message.content.startsWith('identify'))
            {

                this.addDiscordUserRequest(message);
            }
        }
        else
        {
            super.processCommand(message);
        }
    }
}

module.exports = NSCoDDieBot;