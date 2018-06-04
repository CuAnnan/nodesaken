let UseGroup = require('./UseGroup'),
	Merit = require('./Merit'),
	StyleIndividualMerit = require('./StyleIndividualMerit');

class MeritList extends UseGroup
{
	constructor()
	{
		super('Merits', null);
		this.maxCP = 10;
		this.styleMerits = {};
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
	
	addMerit(index, merit)
	{
		if(merit instanceof StyleIndividualMerit)
		{
			this.addStyleMerit(merit);
		}
		
		merit.useGroup = this;
		this.items['merit_'+index] = merit;
	}
	
	removeMerit(index)
	{
		delete this.items['merit_'+index];
	}
	
	getMerit(index)
	{
		return this.items['merit_'+index];
	}
	
	addStyleMerit(merit)
	{
		for(let style of merit.styleTags)
		{
			if(!this.styleMerits[style])
			{
				this.styleMerits[style] = [];
			}
			this.styleMerits[style].push(merit);
		}
	}
	
	get cpRemaining()
	{
		let cpRemaining = this.maxCP;
		for(let i in this.items)
		{
			cpRemaining -= this.items.cost.cp;
		}
		return cpRemaining;
	}
	
	balanceCP()
	{
		let cpRemaining = this.cpRemaining;
		for(let i = 0; i < this.count && cpRemaining > 0; i++)
		{
			let merit = this.items[i];
			if(merit.xpLevels > 0)
			{
				cpRemaining = merit.convertXPToSP(cpRemaining);
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