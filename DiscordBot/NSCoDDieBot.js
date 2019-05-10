/**
 * This bot extends CoDDieBot with Nodesaken Specific methods
 */

const   CoDDieBot = require('coddiebot'),
        Character = require('../characterModel/Character'),
        DiscordCharacterController = require('../controllers/DiscordCharacterController'),
        DiscordUserController = require('../controllers/DiscordUserController'),
        DiscordGameController = require('../controllers/DiscordGameController'),
        ObjectCache = require('objectcache').getInstance();

let instancedBot = null;

class NSCoDDieBot extends CoDDieBot
{
    constructor(conf)
    {
        super(conf);
        this.playerCategories = {};
    }

    static instantiateStaticBot(conf)
    {
        instancedBot = new NSCoDDieBot(conf);
        return instancedBot;
    }

    static getStaticInstance()
    {
        if(!instancedBot)
        {
            throw new Error('Bot has not been instanced');
        }
        return instancedBot;
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

    parseCharacterPool(commandParts, message, character)
    {
        let data = {pool:0, sitMods:0},
            poolSearch = true;

        for(let commandPart of commandParts)
        {

            if(character && character.getPurchasable(commandPart))
            {
                let purchasable = character.getPurchasable(commandPart);
                data.pool += purchasable.score;
            }
            else if(!isNaN(commandPart))
            {
                if(poolSearch)
                {
                    poolSearch = false;
                    data.pool = parseInt(commandPart);
                }
                else
                {
                    data.sitMods += parseInt(commandPart);
                }
            }
        }
        return data;
    }

    characterPreProcess(commandParts, message, character)
    {
        let tricks = this.processRoteAdvanced(message),
            critAndExplode = this.processCritExplode(message),
            pool = this.parseCharacterPool(commandParts, message, character),
            data = Object.assign({}, tricks, critAndExplode, pool);
        return data;
    }

    simpleRoll(commandParts, message, comments)
    {
        let character;
        if(character = ObjectCache.get(message.author.id))
        {
            let data = this.characterPreProcess(commandParts, message, character), roll;

            if(data.advanced)
            {
                roll = this.getAdvancedAction(data);
            }
            else
            {
                roll = this.getSimpleAction(data);
            }
            this.displayResults(roll, message, comments);
        }
        else
        {
            return super.simpleRoll(commandParts, message, comments);
        }
    }

    async linkGameToServer(commandParts, message, comments)
    {
        await DiscordGameController.linkGameServer(commandParts[0], message);
    }

    async checkCharacterOut(commandParts, message, comments)
    {
        let characterData = await DiscordCharacterController.getCharacterByReference(commandParts[0], message.author.id),
            character = Character.fromJSON(characterData);
        ObjectCache.put(message.author.id, character);
    }

    async getSortedChannelNamesByServerId(serverId)
    {
        if(!serverId)
        {
            return null;
        }
        let guild = await this.client.guilds.get(serverId),
            categories = guild.channels.filter(channel=>channel.type === 'category').array(),
            textChannels = guild.channels.filter(channel=>channel.type === 'text').array(),
            sortedChannels = {
                'top':{channels:{}, name:'Uncategorised'}
            };
        for(let category of categories)
        {
            sortedChannels[category.id] = {channels:{},name:category.name};
        }
        for(let channel of textChannels)
        {
            if(channel.parentID)
            {
                sortedChannels[channel.parentID].channels[channel.id] = {name: channel.name, id:channel.id};
            }
            else
            {
                sortedChannels.top.channels[channel.id] =  {name: channel.name, id:channel.id};
            }
        }

        return sortedChannels;

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