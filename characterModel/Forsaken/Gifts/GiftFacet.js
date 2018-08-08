class GiftFacet
{
	constructor(data, gift)
	{
		this.gift = gift;
		this.name = data.name;
		this.unlocked = false;
		this.poolParts = data.pool;
		this.activationCost = data.activationCost;
		this.data = data;
		this.freeFacet = false;
		this.giftList = data.giftList;
		this.renown = data.renown;
		this.available = false;
		this.action = data.action;
		this.duration = data.duration;
	}
	
	lock()
	{
		this.unlocked = false;
		this.freeFacet = false;
	}
	
	unlock(freeFacet)
	{
		this.unlocked = true;
		this.freeFacet = freeFacet;
	}
	
	get pool()
	{
		if(this.poolParts)
		{
			return Object.values(this.poolParts).join('+');
		}
		else
		{
			return '-';
		}
	}
	
	toJSON()
	{
		return {
			name:this.name,
			renown:this.renown,
			freeFacet:this.freeFacet
		};
	}
	
	get cost()
	{
		return (!this.unlocked || this.freeFacet) ? 0 : 1;
	}
	
}

module.exports = GiftFacet;