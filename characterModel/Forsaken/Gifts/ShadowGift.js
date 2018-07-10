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
		if(this.startingGift)
		{
			return {xp:0, cp:1};
		}
		return {
			xp:this.affinity?3:5,
			cp:0
		};
	}
	
	
	
	setAffinity(affinity)
	{
		this.affinity = affinity;
	}
	
	getAffinity()
	{
		return this.affinity;
	}
	
	unlockRenownFacet(renown)
	{
		this.unlock();
		this.facets[renown].unlock();
	}
}

module.exports = ShadowGift;