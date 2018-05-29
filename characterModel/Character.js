let Skill = require('./Skill'), Attribute = require('./Attribute'), UseGroupContainer = require('./UseGroupContainer'),
	MeritList = require('./MeritList'), Listenable = require('./Listenable'), Morality = require('./Morality'),
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
	},
	attributeCategoryMap = {
		'Power':['Intelligence', 'Strength', 'Presence'],
		'Finesse':['Wits', 'Dexterity', 'Manipulation'],
		'Resistance':['Resolve', 'Stamina', 'Composure']
	};

for(let skillName in skillUseGroupMap)
{
	let useGroup = skillUseGroupMap[skillName];
	skillUseGroups[useGroup].push(skillName);
}

class Character extends Listenable
{
	constructor(data)
	{
		super();
		this.name = data.name;
		this.player = data.player;
		this.skills = null;
		this.attributes = null;
		this.lookups = {};
		this.attributeCategories = {}
		this.derivedAttributes = {size:5};
		this.size = 5;
		this.merits = null;
		this.personalDetails = {};
		this.populateUseGroups();
		this.morality = new Morality('Integrity');
		this.lookups['Morality'] = this.lookups['morality'] = this.morality;
	}
	
	populateUseGroups()
	{
		this.skills = this.populateUseGroup('skills', skillUseGroups, Skill, [11, 7, 4]);
		this.attributes = this.populateUseGroup('attributes', attributeUseGroups, Attribute, [5, 4, 3]);
		this.merits = new MeritList();
		for(let i in attributeCategoryMap)
		{
			this.attributeCategories[i] = {};
			for(let a of attributeCategoryMap[i])
			{
				this.attributeCategories[i][a] = this.lookups[a];
			}
		}
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
				this.lookups[thing.toLowerCase()] = thingObject;
			}
		}
		return ugc;
	}
	
	addMerit(index, merit)
	{
		this.merits.add(index, merit);
	}
	
	getPurchasable(searchField)
	{
		return this.lookups[searchField.toLowerCase()];
	}
	
	sortUseGroups()
	{
		this.attributes.sort();
	}
	
	setItemLevel(itemName, level)
	{
		let item = this.lookups[itemName];
		let result = item.score = level;
		this.calculateDerived();
		this.triggerEvent('changed');
		return item.score;
	}
	
	calculateDerived()
	{
		this.derivedAttributes = {
			willpower:this.addScores('Resolve', 'Composure'),
			health:this.addScores('Stamina', this.size),
			initiative:this.addScores('Dexterity', 'Composure'),
			speed:this.addScores('Dexterity', 'Strength', 5),
			defense:this.getDefense(),
			perception:this.addScores('Wits', 'Composure'),
		};
		for(let i in this.derivedAttributes)
		{
			this.lookups[i] = {score: this.derivedAttributes[i]};
		}
	}
	
	getDerivedAttribute(name)
	{
		return this.derivedAttributes[name];
	}
	
	getDefense()
	{
		let skill = 'Athletics';
		if(this.hasMerit('Defensive Fighting - Brawl') && (this.lookups.Brawl.score > this.lookups.Athletics.score))
		{
			skill = 'Brawl';
		}
		else if(this.hasMerit('Defensive Fighting - Weaponry') && (this.lookups.Weaponry.score > this.lookups.Athletics.score))
		{
			skill = 'Weaponry';
		}
		
		return Math.min(
			this.addScores('Wits', skill),
			this.addScores('Dexterity', skill)
		);
	}
	
	hasMerit(meritName)
	{
		return this.merits.hasMerit(meritName);
	}
	
	addScores()
	{
		let result = 0;
		
		for(let i in arguments)
		{
			if(arguments[i]/1 == arguments[i])
			{
				result += arguments[i];
			}
			else
			{
				let item = this.lookups[arguments[i]];
				result += item.score > 0 ? item.score : (0 - item.penalty);
			}
		}
		
		return result;
	}
	
	loadJSON(data)
	{
		let universalLookups = ['skills', 'attributes'];
		for(let i of universalLookups)
		{
			for(let j in data[i])
			{
				let json = data[i][j];
				this.lookups[json.name].loadJSON(json)
			}
		}
		this.calculateDerived();
	}
	
	toJSON()
	{
		let json =  {
			skills: this.skills.toJSON(),
			attributes: this.attributes.toJSON()
		};
		
		return json;
	}
}

module.exports = Character;