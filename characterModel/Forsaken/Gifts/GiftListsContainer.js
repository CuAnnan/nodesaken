let ShadowGift = require('./ShadowGift'),
	WolfGift = require('./WolfGift'),
	tribalGifts = {
		'Blood Talons':['Inspiration', 'Rage', 'Strength'],
		'Bone Shadows':['Death', 'Elemental', 'Insight'],
		'Hunters in Darkness':['Nature', 'Stealth', 'Warding'],
		'Iron Masters':['Knowledge', 'Shaping', 'Technology'],
		'Storm Lords':['Evasion', 'Dominance', 'Weather'],
	},
	auspiciousGifts = {
		'Cahalith':['Inspiration', 'Knowledge'],
		'Elodoth':['Insight', 'Warding'],
		'Irraka':['Evasion', 'Stealth'],
		'Ithaeur':['Elemental', 'Shaping'],
		'Rahu':['Dominance', 'Strength'],
	};

class GiftListsContainer
{
	constructor(renown)
	{
		this.shadow = {};
		this.moon = {};
		this.wolf = {};
		this.auspice = null;
		this.tribe = null;
		this.affinityGifts = [];
		this.startingShadowGifts = [];
		this.startingWolfGiftFacet = 0;
	}
	
	setAuspice(auspice)
	{
		this.auspice = auspice;
		this.setAffinityGifts();
		return this;
	}
	
	setTribe(tribe)
	{
		this.tribe = tribe;
		this.setAffinityGifts();
		return this;
	}
	
	setAffinityGifts()
	{
		this.affinityGifts = [];
		// build up the array of affinity gifts
		if(this.tribe)
		{
			// spread in the tribal gifts;
			this.affinityGifts.push(...tribalGifts[this.tribe]);
		}
		if(this.auspice)
		{
			// spread in the auspicious gifts
			this.affinityGifts.push(...auspiciousGifts[this.auspice]);
		}
	}
	
	/**
	 *
	 * @param {Object} unlockedRenowns  A keyed array of renown names with value of true if the character has any
	 *                                  levels of that renown at all.
	 */
	fetchAvailableShadowGiftFacets(unlockedRenowns)
	{
		let gifts = [];
		
		for(let gift of Object.values(this.shadow))
		{
			gift.availableRenown = unlockedRenowns;
			gift.affinity = this.affinityGifts.indexOf(gift.shorthand) >= 0;
			gifts.push(gift);
		}
		gifts.sort((a, b)=>{return a.name > b.name});
		
		return gifts;
	}
	
	fetchAvailableWolfGiftFacets(unlockedRenowns)
	{
		let gifts = [];
		for(let gift of Object.values(this.wolf))
		{
			gift.availableRenown = unlockedRenowns;
			gift.affinity = true;
			gifts.push(gift);
		}
		gifts.sort((a, b)=>{return a.name > b.name});
		return gifts;
	}
	
	loadShadowGiftsFromJSON(json)
	{
		for(let giftJSON of Object.values(json))
		{
			this.shadow[giftJSON.shorthand] = new ShadowGift(giftJSON);
		}
	}
	
	loadWolfGiftsFromJSON(json)
	{
		for(let giftJSON of Object.values(json))
		{
			this.wolf[giftJSON.shorthand] = new WolfGift(giftJSON);
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
			let gift = gifts[giftIndex],
				facets = Object.values(gift.facets),
				facetIndex = 0;
			while(facetIndex < facets.length && giftFacets.length < 10)
			{
				let facet = facets[facetIndex];
				if(facet.unlocked)
				{
					giftFacets.push(facet);
				}
				facetIndex++;
			}
			giftIndex++;
		}
		console.log(giftFacets);
		return giftFacets;
	}
	
	get unlockedShadowGiftFacets()
	{
		let unlockedShadowGiftFacets = [];
		for(let gift of Object.values(this.shadow))
		{
			for(let facet of gift.unlockedFacets)
			{
				unlockedShadowGiftFacets.push(facet);
			}
		}
		return unlockedShadowGiftFacets;
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
	
	/**
	 * This is straight forward
	 * @param list The list the gift facet belongs to
	 * @param gift The gift the gift facet belongs to
	 * @param facet The facet to unlock
	 * @return  Returns true if this is the first unlocked facet. This is needed for knowing whether or not to apply the
	 *          freePick from Renown checkbox
	 */
	unlockFacet(list, giftShorthand, renown, freePick)
	{
		let gift = this[list][giftShorthand];
		console.log(gift);
		gift.unlockFacet(renown, freePick);
		if(list == 'shadow')
		{
			// you can only choose affinity gifts as starting gifts
			// and at that only if there are fewer than 2 picked
			// and at that only if you haven't already picked this gift list
			if (this.startingShadowGifts.length < 2 && this.affinityGifts.indexOf(giftShorthand) >= 0 && this.startingShadowGifts.indexOf(giftShorthand) == -1)
			{
				this.startingShadowGifts.push(giftShorthand);
				gift.startingGift = true;
				return true;
			}
		}
		return false;
	}
	
	lockFacet(list, giftShorthand, renown)
	{
		let gift = this[list][giftShorthand];
		if(list == 'shadow')
		{
			let giftIndex = this.startingShadowGifts.indexOf(giftShorthand);
			if(giftIndex >= 0)
			{
				this.startingShadowGifts.splice(giftIndex, 1);
				gift.startingGift = false;
			}
		}
		return gift.lockFacet(renown);
	}
	
	setGiftFacetFreePick(list, giftShorthand, renown, freePick)
	{
		this[list][giftShorthand].setGiftFacetFreePick(renown, freePick);
	}
	
	toJSON()
	{
		let giftsJSON= {'shadow':[], wolf:[]};
		for(let gift of Object.values(this.shadow))
		{
			if(gift.unlocked)
			{
				giftsJSON.shadow.push(gift.toJSON());
			}
		}
		for(let gift of Object.values(this.wolf))
		{
			if (gift.unlockedFacetCount)
			{
				giftsJSON.wolf.push(gift.toJSON());
			}
		}
		giftsJSON.startingShadowGifts = this.startingShadowGifts;
		return giftsJSON;
	}
	
	loadJSON(giftsData)
	{
		if(!giftsData)
		{
			return;
		}
		if(giftsData.shadow)
		{
			this.loadGiftsData('shadow', giftsData.shadow);
		}
		if(giftsData.wolf)
		{
			this.loadGiftsData('wolf', giftsData.wolf);
		}
		this.startingShadowGifts = giftsData.startingShadowGifts?giftsData.startingShadowGifts:[];
	}
	
	loadGiftsData(giftList, data)
	{
		
		for (let giftData of data)
		{
			if(this[giftList][giftData.shorthand])
			{
				this[giftList][giftData.shorthand].loadJSON(giftData);
			}
		}
	}
}

module.exports = GiftListsContainer;