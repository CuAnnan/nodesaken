class GiftFacet
{
	constructor(data)
	{
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
	
	toJSON()
	{
		return {
			name:this.name,
			renown:this.renown
		};
	}
	
}

module.exports = GiftFacet;