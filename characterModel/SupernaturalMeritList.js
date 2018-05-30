let MeritList = require('./MeritList');

class SupernaturalMeritList extends MeritList
{
	constructor()
	{
		super();
		this.powerStat = null;
	}
	
	get cpRemaining()
	{
		let cpRemaining = this.maxCP - this.powerStat.cost.cp;
		for(let i in this.items)
		{
			if(this.items[i])
			{
				cpRemaining -= this.items[i].cost.cp;
			}
		}
		return cpRemaining;
	}
}

module.exports = SupernaturalMeritList;