'use strict';
let UseGroup = require('./UseGroup'),
	Merit = require('./Merit'),
	FightingStyle = require('./FightingStyle'),
	StyleIndividualMerit = require('./StyleIndividualMerit');

class MeritList extends UseGroup
{
	constructor()
	{
		super('Merits', null);
		this.maxCP = 10;
		
		this.fightingStyles = {};
		this.individualStyleMerits = {};
		this.allStyleMerits = {};
		
		this.items = {};
	}
	
	add(index, merit)
	{
		this.addMerit(index, merit);
	}
	
	toJSON()
	{
		let json = {};
		for(let i in this.items)
		{
			json[i] = this.items[i].toJSON();
		}
		return json;
	}
	
	/**
	 * Merits are added at a specific index to allow them to be laid out where the player wants, for organisational
	 * reasons. You might want all your social merits together, or all your influences and statuses, etc.
	 * @param index The index to put it at
	 * @param merit The merit
	 */
	addMerit(index, merit)
	{
		if (merit instanceof FightingStyle)
		{
			this.addFightingStyle(merit);
		}
		else if(merit instanceof StyleIndividualMerit)
		{
			this.addIndividualStyleMerit(merit);
		}
		
		if(this.items['merit'+index])
		{
			this.removeMerit(index);
		}
		
		merit.useGroup = this;
		this.items['merit_'+index] = merit;
	}

	getMerit(index)
	{
		return this.items['merit_'+index];
	}
	
	/**
	 * TODO: Handle fighting style removal. Which is going to involve looping through the list of styles in their various locations and deleting them.
	 * @param index
	 */
	removeMerit(index)
	{
		let merit = this.items['merit_'+index];
		if(merit instanceof FightingStyle)
		{
			this.removeFightingStyle(merit);
		}
		else if(merit instanceof StyleIndividualMerit)
		{
			this.removeIndividualStyleMerit(merit);
		}
		delete this.items['merit_'+index];
		return merit;
	}
	
	addFightingStyle(merit)
	{
		this.addMeritToSpecificList(merit, this.fightingStyles);
		this.addMeritToSpecificList(merit, this.allStyleMerits);
	}
	
	removeFightingStyle(merit)
	{
		this.removeMeritFromSpecificList(merit, this.fightingStyles);
		this.removeMeritFromSpecificList(merit, this.allStyleMerits);
	}
	
	getStyleTagScore(styleTag)
	{
		let styleTagScore = 0;
		for(let merit of this.allStyleMerits[styleTag])
		{
			styleTagScore += merit.score;
		}
		return Math.min(styleTagScore, 5);
	}
	
	addIndividualStyleMerit(merit)
	{
		this.addMeritToSpecificList(merit, this.individualStyleMerits);
		this.addMeritToSpecificList(merit, this.allStyleMerits);
	}
	
	removeIndividualStyleMerit(merit)
	{
		this.removeMeritFromSpecificList(merit, this.individualStyleMerits);
		this.removeMeritFromSpecificList(merit, this.allStyleMerits);
	}
	
	addMeritToSpecificList(merit, list)
	{
		for(let style of merit.styleTags)
		{
			if(!list[style])
			{
				list[style] = [];
			}
			list[style].push(merit);
		}
	}
	
	removeMeritFromSpecificList(merit, list)
	{
		for(let style of merit.styleTags)
		{
			let index = list.indexOf(merit);
			delete list[index];
		}
	}
	
	get count()
	{
		return Object.values(this.items).length;
	}
	
	get cpRemaining()
	{
		let cpRemaining = this.maxCP,
			merits = Object.values(this.items);
		for(let merit of merits)
		{
			cpRemaining -= merit.cost.cp;
		}
		return cpRemaining;
	}
	
	balanceCP()
	{
		let cpRemaining = this.cpRemaining,
			count = this.count;
		for(let i = 0; i < count && cpRemaining > 0; i++)
		{
			let merit = this.items[i];
			if(merit)
			{
				if (merit.xpLevels > 0)
				{
					cpRemaining = merit.convertXPToSP(cpRemaining);
				}
			}
		}
		
	}
	
	hasMerit(meritName)
	{
		let found = false,
			keys = Object.keys(this.items);
		
		for(let i = 0; i < keys.length && !found; i++)
		{
			let merit = this.items[keys[i]];
			if(merit)
			{
				if(merit.name == meritName)
				{
					found = true;
				}
			}
		}
		return found;
	}

	getMeritsEffecting(derivedAttribute)
	{
		let keys = Object.keys(this.items),
			merits = [];
		for(key of keys)
		{
			let merit = this.items[key];
			if(merit.effects == derivedAttribute)
			{
				merits.push(merit);
			}
		}
		return merits;
	}
	
	getModifiersFor(derivedAttribute)
	{
		let keys = Object.keys(this.items),
			modifier = 0;
		for(let i = 0; i < keys.length; i++)
		{
			let merit = this.items[keys[i]];
			if(merit.effects == derivedAttribute)
			{
				if(merit.modifiers)
				{
					let modifierIndex = merit.levels.indexOf(merit.score);
					modifier += merit.modifiers[modifierIndex];
				}
				else
				{
					modifier += merit.score;
				}
				
			}
		}
		return modifier;
	}
}

module.exports = MeritList;