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
			this.facets[i] = new GiftFacet(facet);
		}
		this.unlockedFacets = 0;
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
	
	unlockFacet(renown)
	{
		this.unlockedFacets++;
		this.unlock();
		this.facets[renown].unlock();
	}
	
	lockFacet(renown)
	{
		this.facets[renown].lock();
		this.unlockedFacets--;
		if(!this.unlockedFacets)
		{
			this.lock();
		}
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
			this.unlockFacet(facet.renown);
		}
	}
}

module.exports = Gift;