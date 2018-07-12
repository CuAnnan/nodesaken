class GiftFacet
{
	constructor(data)
	{
		this.name = data.name;
		this.unlocked = false;
		this.poolParts = data.pool;
		this.activationCost = data.cost;
		this.data = data;
		this.freeFacet = false;
		this.giftList = data.giftList;
		this.renown = data.renown;
		this.available = false;
	}
	
	lock()
	{
		this.unlocked = false;
	}
	
	unlock()
	{
		this.unlocked = true;
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
	
}

module.exports = GiftFacet;