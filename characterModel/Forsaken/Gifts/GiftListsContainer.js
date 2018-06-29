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
			gifts[gift.name] = gift.getAvailableFacets(unlockedRenowns);
		}
		return gifts;
	}
	
	loadShadowGiftsFromJSON(json)
	{
		for(let giftJSON of Object.values(json))
		{
			this.shadow[giftJSON.name] = new ShadowGift(giftJSON);
		}
	}
	
	loadMoonGifts()
	{
	
	}
	
	loadWolfGifts()
	{
	
	}
}

module.exports = GiftListsContainer;