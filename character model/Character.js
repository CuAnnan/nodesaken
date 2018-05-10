let Skill = require('./Skill'),
	Attribute = require('./Attribute'),
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
		this.populateUseGroups();
	}
	
	populateUseGroups()
	{
		this.skills = this.populateUseGroup('skills', skillUseGroups, Skill, [11, 7, 4]);
		this.attributes = this.populateUseGroup('attributes', attributeUseGroups, Attribute, [5, 4, 3]);
	}
	
	populateUseGroup(type, map, classReference, cpAmounts)
	{
		let ugc = new UseGroupContainer(type, cpAmounts);
		for(let i in map)
		{
			for(let thing of map[i])
			{
				let thingObject = new classReference(thing);
				ugc.addToUseGroup(i, thingObject);
				this.lookups[thing] = thingObject;
			}
		}
		return ugc;
	}
	
	sortUseGroups()
	{
		this.attributes.sort();
	}
	
	setItemLevel(itemName, level)
	{
		let item = this.lookups[itemName];
		let result = item.level = level;
		return item.score;
	}
}

module.exports = Character;