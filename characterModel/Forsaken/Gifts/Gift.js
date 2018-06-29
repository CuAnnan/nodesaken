let GiftFacet = require('./GiftFacet');

class Gift
{
	constructor(data)
	{
		this.name = data.name;
		this.shorthand = data.shorthand;
		this.facets = {};
		for(let i in data.facets)
		{
			this.facets[i] = new GiftFacet(data.facets[i]);
		}
		this.unlocked = false;
	}
	
	get cost()
	{
		let cost = {xp:0, cp:0};
		for(let facet of this.facets)
		{
			let facetCost = facet.cost;
			cost.xp += facetCost.xp;
			cost.cp += facetCost.cp;
		}
		return cost;
	}
	
	unlock()
	{
		this.unlocked = true;
	}
	
	lock()
	{
		this.unlocked = false;
	}
}

module.exports = Gift;