/**
 * This bot extends CoDDieBot with Nodesaken Specific methods
 */

const   CoDDieBot = require('coddiebot'),
        Character = require('../characterModel/Character'),
        DiscordCharacterController = require('../controllers/DiscordCharacterController'),
        DiscordUserController = require('../controllers/DiscordUserController'),
        DiscordGameController = require('../controllers/DiscordGameController'),
        ObjectCache = require('objectcache').getInstance(),
        shortcuts = {
            'hishu':['h', 'hi', 'his', 'hish', 'hishu'],
            'dalu':['d', 'da', 'dal', 'dalu'],
            'gauru':['g', 'ga', 'gau', 'gaur', 'gauru'],
            'urshul':['us', 'urs', 'ursh', 'urshu', 'urshul'],
            'urhan':['uh', 'urh', 'urha', 'urhan']
        };
let forms = [];
for(let form in shortcuts)
{
    for(let shortcut of shortcuts[form])
    {
        forms[shortcut] = form;
    }
}

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
        this.attachCommand('shift', this.shapeShift);
        this.attachCommand('getForm', this.getForm);
        this.addCommandAliases(
            {'shift': ['setform', 'shapeshift']},
            {'getForm':['form']}
        );
    }

    getSettingsToSave()
    {
        let settings = super.getSettingsToSave();
        settings.playerChannelCategories = this.playerCategories;

        return settings;
    }

    parseCharacterPool(commandParts, message, character)
    {
        let data = {pool:0, sitMods:0, poolParts:[]},
            poolSearch = true;

        for(let commandPart of commandParts)
        {

            if(character && character.getPurchasable(commandPart))
            {
                let purchasable = character.getPurchasableScore(commandPart);
                data.pool += purchasable.score;
                data.poolParts.push(commandPart);
                poolSearch = true;
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

    async simpleRoll(commandParts, message, comments)
    {
        let character;
        if(character = await DiscordCharacterController.getDefaultCharacter(message.author.id, message.guild.id))
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
            this.displayResults(roll, message, comments, `Rolling ${data.poolParts.join(' + ')} for ${character.name}`);
        }
        else
        {
            return super.simpleRoll(commandParts, message, comments);
        }
    }

    displayResults(action, message, comment, descriptor)
    {
        let results = descriptor+"\n"+action.getResults();

        if(results.constructor === Array)
        {
            this.sendMessageArray(results, message, comment);
            return;
        }

        this.sendOneLineMessage(results, message, comment);
    }

    async shapeShift(commandParts, message, comments)
    {
        let character;
        if(character = await this.getCheckedOutCharacter(message))
        {
            let form = commandParts[0];
            if (!forms[form])
            {
                message.reply(`${(Math.random() > 0.5) ? 'Father' : 'Mother'} Luna has not granted you the form of ${commandParts[0]}`);
            }

            character.shapeshift(forms[form]);
        }
        return null;
    }

    async getForm(commandParts, message, comments)
    {
        let character;
        if(character = await this.getCheckedOutCharacter(message))
        {
            message.reply(`${character.name} is currently in ${character.currentForm}`);
        }
        return null;
    }

    async getCheckedOutCharacter(message)
    {
        let character;
        if(character = await DiscordCharacterController.getDefaultCharacter(message.author.id, message.guild.id))
        {
            return character;
        }
        message.reply('This command requires a checked out character');
    }

    async linkGameToServer(commandParts, message, comments)
    {
        await DiscordGameController.linkGameServer(commandParts[0], message);
    }

    async checkCharacterOut(commandParts, message, comments)
    {
        await DiscordCharacterController.cacheCharacterByReference(commandParts[0], message.author.id, message.guild.id);
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