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
			let facet = data.facets[i];
			facet.renown = i;
			facet.giftList = this.shorthand;
			this.facets[i] = new GiftFacet(facet, this);
		}
		this.unlockedFacetCount = 0;
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
	
	set availableRenown(availableRenown)
	{
		for(let facet of Object.values(this.facets))
		{
			facet.available = availableRenown[facet.renown];
		}
	}
	
	get availableFacets()
	{
		let facets = [];
		for(let facet of Object.values(this.facets))
		{
			if(facet.available && !facet.unlocked)
			{
				facets.push(facet);
			}
		}
		return facets;
	}
	
	get unlockedFacets()
	{
		let facets = [];
		for(let facet of Object.values(this.facets))
		{
			if(facet.unlocked)
			{
				facets.push(facet);
			}
		}
		return facets;
	}
	
	unlockFacet(renown, freePick)
	{
		this.unlock();
		this.facets[renown].unlock(this.unlockedFacetCount == 0 || freePick);
		this.unlockedFacetCount++;
		return this.facets[renown];
	}
	
	lockFacet(renown)
	{
		this.facets[renown].lock();
		this.unlockedFacetCount--;
		if(!this.unlockedFacetCount)
		{
			this.lock();
		}
		return this.facets[renown];
	}
	
	unlockRenownFacet(renown)
	{
		this.unlock();
		this.facets[renown].unlock();
	}
	
	toJSON()
	{
		let JSON = {
			'shorthand':this.shorthand,
			facets:[]
		};
		for(let facet of Object.values(this.facets))
		{
			if(facet.unlocked)
			{
				JSON.facets.push(facet.toJSON());
			}
		}
		return JSON;
	}
	
	loadJSON(json)
	{
		for(let facet of json.facets)
		{
			this.unlockFacet(facet.renown, facet.freeFacet!=='false');
		}
	}
}

module.exports = Gift;