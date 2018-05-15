let UseGroup = require('./UseGroup');

class MeritList extends UseGroup
{
	constructor()
	{
		super('Merits', null);
		this.maxCP = 10;
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
		for(let i = 0; i < this.items.length && cpRemaining > 0; i++)
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
		let found = false;
		for(let i = 0; i < this.items.length && !found; i++)
		{
			let merit = this.items[i];
			if(merit.name == meritName)
			{
				found = true;
			}
		}
		return false;
	}
}

module.exports = MeritList;