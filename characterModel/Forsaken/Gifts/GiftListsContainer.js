let ShadowGift = require('./ShadowGift'),
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