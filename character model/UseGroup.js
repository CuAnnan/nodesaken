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
}

module.exports = UseGroup;