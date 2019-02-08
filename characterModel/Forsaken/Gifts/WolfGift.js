let Gift = require('./Gift');

class WolfGift extends Gift
{
	constructor(data)
	{
		super(data);
		this.unlocked = true;
	}
	
	get cost()
	{
		let cost = {
			xp:this.startingGift?0:(this.affinity?3:5),
			cp:this.startingGift?1:0
		};
		for(let facet of Object.values(this.facets))
		{
			cost.xp += facet.cost;
		}
		return cost;
	}
}

module.exports = WolfGift;