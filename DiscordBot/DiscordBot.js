"use strict";
let conf = require(global.appRoot+'/conf.js'),
	fs = require('fs');

class DiscordBot
{
	constructor()
	{
		this.commands = {};
		this.commandPrefix = conf.commandPrefix;
		this.commandPrefixOverrides = {};
		this.deleteMessageOverrides = {};
		this.authorisedRoles = {};
		this.authorisedUsers = {};
		this.attachCommands();
	}
	
	async hoist(client)
	{
		this.client = client;
		this.user = client.user;
		let settings = this.getJSONFromFile(__dirname+'/settings.json'),
			settingsToHoist = this.getSettingsToSave();
		for(let setting in settingsToHoist)
		{
			this[setting] = settings[setting]?settings[setting]:{}
		}
		this.listen();
		
		return settings;
	}
	
	listen()
	{
		this.client.on('message',(message)=>{
			try
			{
				if (message.author.bot)
				{
					return;
				}
				this.processCommand(message);
			}
			catch(e)
			{
				console.warn(e);
			}
		});
		this.client.on('guildMemberRemove',(member)=>{
			let index = this.authorisedUsers[member.guild.id].indexOf(member.user.id);
			if(index >= 0)
			{
				this.authorisedUsers[member.guild.id].splice(index, 1);
			}
		});
	}
	
	getJSONFromFile(path)
	{
		let text = fs.readFileSync(path),
			json = JSON.parse(text);
		return json;
	}
	
	async shutdown()
	{
		return this.saveSettings();
	}
	
	elevateCommand(message)
	{
		let member = message.member,
			authorAuthedRoles = [];
		if(this.authorisedRoles[message.guild.id])
		{
			authorAuthedRoles = member.roles.filterArray((role)=>this.authorisedRoles[message.guild.id].indexOf(role.id) !== -1);
		}
		
		if(message.guild.owner.id === message.author.id || this.authorisedUsers[message.guild.id].indexOf(message.author.id) > -1 || authorAuthedRoles.length > 0)
		{
			return;
		}
		throw new Error('This action is only allowable by the server owner or by authorised users or users with an authorised role');
	}
	
	attachCommand(command, callback, rescope = true)
	{
		if(rescope)
		{
			callback = callback.bind(this);
		}
		
		
		this.commands[command.toLowerCase()] = callback;
	}
	
	attachCommands()
	{
		this.attachCommand('setCommandPrefix', this.setCommandPrefixForGuild);
		this.attachCommand('setCommandDelete', this.setDeleteMessages);
		this.attachCommand('authoriseUsers', this.authoriseUser);
		this.attachCommand('authoriseRole', this.authoriseRole);
		this.attachCommand('showAuthorised', this.showAuthorised);
		this.attachCommand('deauthoriseUsers', this.deauthoriseUser);
		this.attachCommand('deauthoriseRole', this.deauthoriseRole);
		this.addCommandAliases({
			'authoriseUsers':['authoriseUser', 'authUser', 'authUsers'],
			'authoriseRole':['authRole'],
			'deauthoriseUsers':['deauthoriseUser', 'deauthUser', 'deauthUsers'],
			'deauthoriseRole':['deauthRole']
		});
	}
	
	getDeleteMessageForGuild(guildId)
	{
		if(Object.keys(this.deleteMessageOverrides).indexOf(guildId) < 0)
		{
			return true;
		}
		return this.deleteMessageOverrides[guildId];
	}
	
	async setDeleteMessages(commandParts, message, comment)
	{
		this.elevateCommand(message);
		if(!commandParts.length)
		{
			return;
		}
		let guildSpecificDeleteString = commandParts[0].trim().toLowerCase(),
			guildSpecificDeleteIndex = ['false', 'f', 'n', 'no'].indexOf(guildSpecificDeleteString),
			guildSpecificDelete = guildSpecificDeleteIndex < 0;
		this.deleteMessageOverrides[message.guild.id] = guildSpecificDelete;
	}
	
	getCommandPrefixForGuild(guildId)
	{
		if(this.commandPrefixOverrides[guildId])
		{
			return this.commandPrefixOverrides[guildId];
		}
		return this.commandPrefix;
	}
	
	async setCommandPrefixForGuild(commandParts, message, comment)
	{
		this.elevateCommand(message);

		if (!commandParts.length)
		{
			return;
		}
		
		let guildSpecificPrefix = commandParts[0].trim();
		if (guildSpecificPrefix.length > 1)
		{
			return;
		}
		if (guildSpecificPrefix === conf.commandPrefix)
		{
			delete this.commandPrefixOverrides[message.guild.id];
		}
		else
		{
			this.commandPrefixOverrides[message.guild.id] = guildSpecificPrefix;
		}
		return this.saveSettings();
	}
	
	async showAuthorised(commandParts, message)
	{
		for(let memberId of this.authorisedUsers[message.guild.id])
		{
			let member = message.guild.members.get(memberId);
		}
	}
	
	async authoriseRole(commandParts, message)
	{
		this.elevateCommand(message);
		if(!commandParts.length)
		{
			return;
		}
		
		let roleName = commandParts.join(' '),
			role = message.guild.roles.find('name', roleName);
		if(role)
		{
			if(!this.authorisedRoles[message.guild.id] || this.authorisedRoles[message.guild.id].indexOf(role.id) === -1)
			{
				this.authorisedRoles[message.guild.id] = this.authorisedRoles[message.guild.id] ? this.authorisedRoles[message.guild.id] : [];
				this.authorisedRoles[message.guild.id].push(role.id);
			}
			else
			{
				message.reply(`${roleName} already has privileges on this server.`);
			}
		}
		else
		{
			message.reply(`I'm sorry, I could not find a role named ${roleName}. Discord role names are case sensitive, please make sure the case is correct.`);
		}
	}
	
	async deauthoriseRole(commandParts, message)
	{
		this.elevateCommand(message);
		if(!commandParts.length)
		{
			return;
		}
		
		let roleName = commandParts.join(' '),
			role = message.guild.roles.find('name', roleName);
		if(role)
		{
			if(!this.authorisedRoles[message.guild.id] || this.authorisedRoles[message.guild.id].indexOf(role.id) === -1)
			{
				message.reply(`Role ${roleName} is not authed on this server`);
				return;
			}
			this.authorisedRoles[message.guild.id].splice(this.authorisedRoles[message.guild.id].indexOf(role.id), 1);
		}
		else
		{
			message.reply(`I'm sorry, I could not find a role named ${roleName}. Discord role names are case sensitive, please make sure the case is correct.`);
		}
	}
	
	async authoriseUser(commandParts, message)
	{
		this.elevateCommand(message);
		
		if(!commandParts.length)
		{
			return;
		}
		
		let alreadyAuthedUsers = [];
		message.mentions.members.forEach((member)=>{
			if (!this.authorisedUsers[message.guild.id] || this.authorisedUsers[message.guild.id].indexOf(member.id) === -1)
			{
				this.authorisedUsers[message.guild.id] = this.authorisedUsers[message.guild.id] ? this.authorisedUsers[message.guild.id] : [];
				this.authorisedUsers[message.guild.id].push(member.id);
			}
			else
			{
				alreadyAuthedUsers.push(member.user.username);
			}
		});
		
		if(alreadyAuthedUsers.length > 0)
		{
			message.reply(`The following users are already authorised ${alreadyAuthedUsers.join(', ')}`);
		}
	}
	
	async deauthoriseUser(commandParts, message)
	{
		this.elevateCommand(message);
		if(!commandParts.length)
		{
			return;
		}
		let notAuthedUsers = [];
		message.mentions.members.forEach((member)=>{
			let index = this.authorisedUsers[message.guild.id].indexOf(member.id);
			if(!this.authorisedUsers[message.guild.id] || index === -1)
			{
				notAuthedUsers.push(member.username);
			}
			else
			{
				this.authorisedUsers[message.guild.id].splice(index, 1);
			}
		});
		if(notAuthedUsers.length)
		{
			message.reply(`The following members didn't have permissions already: ${notAuthedUsers.join(', ')}`);
		}
	}
	
	getSettingsToSave()
	{
		let settingsToSave = {
				'commandPrefixOverrides': this.commandPrefixOverrides,
				'deleteMessages':this.deleteMessageOverrides,
				'authorisedUsers':this.authorisedUsers,
				'authorisedRoles':this.authorisedRoles
			};
		return settingsToSave;
	}
	
	saveSettings()
	{
		let settings = this.getSettingsToSave(),
			data = JSON.stringify(settings);
		return new Promise((resolve, reject) => {
			fs.writeFile(__dirname+'/settings.json', data, (err)=>{
				if(err)
				{
					reject(err);
				}
				else
				{
					resolve(data);
				}
			})
		});
	}
	
	addCommandAlias(command, commandAlias)
	{
		this.commands[commandAlias.toLowerCase()] = this.commands[command.toLowerCase()];
	}
	
	addCommandAliases(data)
	{
		for(let command in data)
		{
			for(let alias of data[command])
			{
				this.addCommandAlias(command, alias);
			}
		}
	}
	
	processCommand(message)
	{
		console.log('Receiving DM');
		if(!message.guild)
		{
			return;
		}
		if (message.channel.type == 'dm')
		{
			message.channel.send("You cannot use this bot via DM yet for technical reasons");
			return;
		}

		let prefix = this.getCommandPrefixForGuild(message.guild.id),
			mentionRegExp = new RegExp(`^<@!?${this.user.id}>`),
			isMention = message.content.match(mentionRegExp);

		if (!(message.content.startsWith(prefix) || isMention))
		{
			return;
		}

		let args;
		if(isMention)
		{
			let atMention = isMention[0];
			args = message.content.replace(atMention, '').trim().split('--');
		}
		else
		{
			args = message.content.substring(1).trim().split('--');
		}
		let comment = args[1] ? args[1].trim() : '',
			commandParts = args[0].split(' '),
			command = commandParts.shift().toLowerCase();
		this.executeCommand(command, commandParts, message, comment);
	}
	
	executeCommand(command, commandParts, message, comment)
	{
		if (this.commands[command])
		{
			this.commands[command](commandParts, message, comment).then(()=>{
				if(this.getDeleteMessageForGuild(message.guild.id))
				{
					message.delete().catch(() => {});
				}
			}).catch((error)=>{
				console.warn(error);
			});
		}
	}
	
	sendDM(user, message)
	{
		user.createDM().then((x)=>{x.send(message);});
	}
	
	cleanMessage(message)
	{
		let concatenatedMessagePart = [],
			concatenatedMessage = [],
			currentMessageLength = 0;
		
		for(let i in message)
		{
			currentMessageLength += message[i].length;
			if(currentMessageLength >= 1800)
			{
				currentMessageLength = 0;
				concatenatedMessage.push(concatenatedMessagePart);
				concatenatedMessagePart = [];
			}
			concatenatedMessagePart.push(message[i]);
		}
		concatenatedMessage.push(concatenatedMessagePart);
		return concatenatedMessage;
	}
}

module.exports = DiscordBot;