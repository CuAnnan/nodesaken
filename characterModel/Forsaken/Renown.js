let XPPurchasable = require('../XPPurchasable');

class Renown extends XPPurchasable
{
	constructor(name)
	{
		super(name);
		this.xpCost = 3;
		this.auspicious = false;
		this.tribal = false;
		this.freeFacets = [];
	}
	
	addFreeRenownFacet(facet)
	{
		this.freeFacets.push(facet);
	}
	
	removeRenownFacet(facet)
	{
		this.freeFacets.slice(this.freeFacets.indexOf(facet), 1);
	}
	
	get freeFacetCount()
	{
		return this.score - this.cpLevels - this.getFreeLevels();
	}
	
	get remainingFreeFacets()
	{
		return this.freeFacetCount - this.freeFacets.length;
	}
	
	get score()
	{
		return this.xpLevels + this.cpLevels + this.getFreeLevels();
	}
	
	setGiftFacetFreePick(giftList, gift, freePick)
	{
		if(freePick && this.remainingFreeFacets > 0)
		{
			this.addFreeRenownFacet(gift);
		}
		else if (freePick)
		{
			throw new Error("Not enough free facets remaining");
		}
		else
		{
			this.removeRenownFacet(gift);
		}
	}
	
	getFreeLevels()
	{
		return 0 + (this.auspicious?1:0) + (this.tribal?1:0);
	}
	
	set score(level)
	{
		this.setScore(level);
	}
	
	toJSON()
	{
		let json = super.toJSON();
		json.freeFacets = this.freeFacets;
		return json;
	}
	
	loadJSON(json)
	{
		super.loadJSON(json);
	}
}

module.exports = Renown;