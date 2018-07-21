let XPPurchasable = require('../../XPPurchasable'),
	Gift = require('./Gift');

class ShadowGift extends Gift
{
	constructor(data)
	{
		super(data);
		this.affinity = false;
		this.startingGift = false;
	}
	
	get cost()
	{
		if(!this.unlocked)
		{
			return {xp:0,cp:0};
		}
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
	
	toJSON()
	{
		let json = super.toJSON();
		json.cost = this.cost;
		return json;
	}
	
	setAffinity(affinity)
	{
		this.affinity = affinity;
	}
	
	getAffinity()
	{
		return this.affinity;
	}
}

module.exports = ShadowGift;