let ShadowGift = require('./ShadowGift');

class GiftListsContainer
{
	constructor(renown)
	{
		this.shadow = {};
		this.moon = {};
		this.wolf = {};
	}
	
	/**
	 *
	 * @param {Object} unlockedRenowns  A keyed array of renown names with value of true if the character has any
	 *                                  levels of that renown at all.
	 */
	fetchAvailableShadowGiftFacets(unlockedRenowns)
	{
		let gifts = {};
		for(let gift of Object.values(this.shadow))
		{
			gifts[gift.shorthand] = gift.getAvailableFacets(unlockedRenowns);
		}
		return gifts;
	}
	
	unlockShadowGiftFacet(giftShorthand, renown)
	{
		this.gifts[giftShorthand].unlock(renown);
	}
	
	loadShadowGiftsFromJSON(json)
	{
		for(let giftJSON of Object.values(json))
		{
			this.shadow[giftJSON.name] = new ShadowGift(giftJSON);
		}
	}
	
	get firstTenShadowFacets()
	{
		return this.getFirstTenFacets(this.shadow);
	}
	
	getFirstTenFacets(source)
	{
		let giftFacets = [], giftIndex = 0, gifts = Object.values(source);
		while(giftFacets.length < 10 && giftIndex < gifts.length)
		{
			let gift = gifts[i],
				facets = Object.values(gift.facets),
				facetIndex = 0;
			while(facetIndex < facets.length && giftFacets.length < 10)
			{
				let facet = facets[i];
				if(facet.unlocked)
				{
					giftFacets.push(facet);
				}
				facetIndex++;
			}
			giftIndex++;
		}
		return giftFacets;
	}
	
	loadMoonGifts()
	{
	
	}
	
	get firstTenWolfFacets()
	{
		return this.getFirstTenFacets(this.wolf);
	}
	
	loadWolfGifts()
	{
	
	}
}

module.exports = GiftListsContainer;