class GiftFacet
{
	constructor(data)
	{
		this.name = data.name;
		this.unlocked = false;
		this.pool = data.pool;
		this.data = data;
		this.freeFacet = false;
		this.giftList = data.giftList;
		this.renown = data.renown;
	}
	
	
	
	lock()
	{
		this.unlocked = false;
	}
	
	unlock()
	{
		this.unlocked = true;
	}
	
	
}

module.exports = GiftFacet;