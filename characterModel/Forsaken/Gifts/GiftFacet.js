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
	
	
}

module.exports = GiftFacet;