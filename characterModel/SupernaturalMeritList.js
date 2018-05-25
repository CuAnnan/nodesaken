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
			cpRemaining -= this.items.cost.cp;
		}
		return cpRemaining;
	}
}

module.exports = SupernaturalMeritList;