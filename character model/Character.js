let Skill = require('./Skill'),
	Attribute = require('./Attribute'),
	modes = require('./XPPurchasableModes'),
	UseGroupContainer = require('./UseGroupContainer'),
	skillUseGroupMap = {
		'Academics':'Mental', 'Computer':'Mental', 'Crafts':'Mental', 'Investigation':'Mental',
		'Medicine':'Mental','Occult':'Mental','Politics':'Mental','Science':'Mental',
		'Athletics':'Physical','Brawl':'Physical','Drive':'Physical','Firearms':'Physical',
		'Larceny':'Physical','Stealth':'Physical','Survival':'Physical','Weaponry':'Physical',
		'Animal Ken':'Social','Empathy':'Social','Expression':'Social','Intimidation':'Social',
		'Persuasion':'Social','Socialize':'Social','Streetwise':'Social','Subterfuge':'Social'
	},
	skillUseGroups = {
		'Mental':[],
		'Physical':[],
		'Social':[]
	},
	attributeUseGroups = {
		'Mental':['Intelligence', 'Wits', 'Resolve'],
		'Physical':['Strength', 'Dexterity', 'Stamina'],
		'Social':['Presence', 'Manipulation', 'Composure']
	};

for(let skillName in skillUseGroupMap)
{
	let useGroup = skillUseGroupMap[skillName];
	skillUseGroups[useGroup].push(skillName);
}

class Character
{
	constructor()
	{
		this.skills = {};
		this.attributes = {};
		this.lookups = {};
		this.purchaseMode = modes.CP;
		this.populateUseGroups();
	}
	
	populateUseGroups()
	{
		this.skills = this.populateUseGroup('skills', skillUseGroups, Skill);
		this.attributes = this.populateUseGroup('attributes', attributeUseGroups, Attribute);
	}
	
	populateUseGroup(type, map, classReference)
	{
		let ugc = new UseGroupContainer(type);
		let useGroups = {};
		for(let i in map)
		{
			console.log(i);
			useGroups[i] = {};
			for(let thing of map[i])
			{
				let thingObject = new classReference(thing);
				ugc.addToUseGroup(type, thingObject);
				this.lookups[thing] = thingObject;
				useGroups[i][thing] = thingObject;
			}
		}
		return useGroups;
	}
	
	set purchaseMode(mode)
	{
		if(!mode === modes.XP && !mode === modes.CP)
		{
			let error = new Error('Invalid purchase mode '+mode+' supplied to purchaseMode setter');
			error.name = 'InvalidPurchaseMode';
			throw error;
		}
		for(let key in this.lookups)
		{
			let item = this.lookups[key];
			item.purchaseMode = mode;
		}
	}
	
	setItemLevel(itemName, level)
	{
		let item = this.lookups[itemName];
		let result = item.level = level;
		return item.score;
	}
}

module.exports = Character;