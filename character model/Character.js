let Skill = require('./Skill'),
	Attribute = require('./Attribute'),
	modes = require('./XPPurchasableModes'),
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

function populateTree(tree, useGroupMap, constructor, lookupTable)
{
	for(let i in useGroupMap)
	{
		tree[i] = {};
		for(let thing of useGroupMap[i])
		{
			let thingObject = new constructor(thing);
			tree[i][thing] = thingObject;
			lookupTable[thing] = thingObject;
			
		}
	}
}

class Character
{
	constructor()
	{
		this.skills = {};
		this.attributes = {};
		this.lookups = {};
		populateTree(this.skills, skillUseGroups, Skill, this.lookups);
		populateTree(this.attributes, attributeUseGroups, Attribute, this.lookups);
		this.purchaseMode = modes.CP;
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