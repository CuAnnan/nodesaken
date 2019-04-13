/**
 * This bot extends CoDDieBot with Nodesaken Specific methods
 */

const   CoDDieBot = require('coddiebot'),
        DiscordCharacterController = require('../controllers/DiscordCharacterController'),
        DiscordUserController = require('../controllers/DiscordUserController'),
        DiscordGameController = require('../controllers/DiscordGameController');

class NSCoDDieBot extends CoDDieBot
{
    constructor(conf)
    {
        super(conf);
        this.playerCategories = {};
    }

    hoist(client)
    {
        return super.hoist(client);
    }

    attachCommands()
    {
        super.attachCommands();
        this.attachCommand('checkOut', this.checkCharacterOut);
        this.attachCommand('stow', this.stowCharacter);
        this.attachCommand('signup', this.signup);
        this.attachCommand('setPlayerCategory', this.setPlayerCategory);
        this.attachCommand('linkServer', this.linkGameToServer);
    }

    getSettingsToSave()
    {
        let settings = super.getSettingsToSave();
        settings.playerChannelCategories = this.playerCategories;

        return settings;
    }

    simpleRoll(commandParts, message, comments)
    {
        return super.simpleRoll(commandParts, message, comments);
    }

    async linkGameToServer(commandParts, message, comments)
    {
        await DiscordGameController.linkGameServer(commandParts[0], message);
    }

    async checkCharacterOut(commandParts, message, comments)
    {
        let authorId = message.author.id,
            guildId = message.guild.id,
            channelId = message.channel.id,
            categoryId = message.channel.parent.id,
            character = await DiscordCharacterController.getCharacterByReference(commandParts[0], message.author.id);
        /*
         * I think the character id to user id match should be "perma" stored in the database. We can TTL the field, so that seems to solve that problem.
         */
    }

    stowCharacter(commandParts, message,comments)
    {
        console.log(comandParts);
    }

    addDiscordUserRequest(message)
    {
        let reference = message.content.split(' ')[1];

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

    /**
     * Sets the player category for this guild
     * @param commandParts
     * @param message
     * @returns {null}
     */
    setPlayerCategory(commandParts, message)
    {
        this.elevateCommand(message);
        let categoryName = commandParts.join(' '),
            category = message.guild.channels.find(channel=>(channel.type === 'category' && channel.name === categoryName));
        this.playerCategories[message.guild.id] = category.id;
        return null;
    }

    /**
     * Get the player category for this guild
     */
    getPlayerCategory(message)
    {
        return this.playerCategories[message.guild.id];
    }

    async signup(commandParts, message)
    {
        let tag = message.author.tag,
            categoryId = this.getPlayerCategory(message);
        if(!categoryId)
        {
            return message.reply('No player category has been set up for this guild, so registrations cannot be concluded');
        }
        else
        {
            return message.guild.createChannel(`${tag}-rolling-Room`);
        }
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