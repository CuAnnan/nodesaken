'use strict';
class UseGroup
{
	/**
	 * @param name
	 * @param contents
	 */
	constructor(name = "", containerReference)
	{
		this.name = name;
		this.penalty = name == 'Mental'?3:1;
		this.containerReference = containerReference;
		this.items = [];
	}
	
	add(thing)
	{
		this.items.push(thing);
		thing.useGroup = this;
	}
	
	get cost()
	{
		let cost = {cp:0, xp:0};
		for(let thing of this.items)
		{
			cost.cp += thing.cost.cp;
			cost.xp += thing.cost.xp;
		}
		return cost;
	}
	
	get cpRemaining()
	{
		return this.containerReference.getMaxCPRemaining(this);
	}
	
	toJSON()
	{
		let json = [];
		for (let i in this.items)
		{
			json.push(this.items[i].toJSON());
		}
		return json;
	}
	
	balanceCP()
	{
		this.containerReference.balance();
	}
	
	convertXPToSP(amount)
	{
		let amountToConvert = amount;
		for(let i = 0; i < this.items.length && amountToConvert > 0; i++)
		{
			let item = this.items[i];
			if(item.xpLevels > 0)
			{
				amountToConvert = item.convertXPToSP(amountToConvert);
			}
		}
	}
	
}

module.exports = UseGroup;