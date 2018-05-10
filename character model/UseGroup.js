class UseGroup
{
	/**
	 * @param name
	 * @param contents
	 */
	constructor(name = "", containerReference)
	{
		this.name = name;
		this.containerReference = containerReference;
		this.items = [];
		this.cost = {cp:0, xp:0};
	}
	
	add(thing)
	{
		this.items.push(thing);
		thing.useGroup = this;
	}
	
	update()
	{
		this.cost = {cp:0, xp:0};
		for(let thing of this.items)
		{
			this.cost.cp += thing.cost.cp;
			this.cost.xp += thing.cost.xp;
		}
	}
	
	get cpRemaining()
	{
		return this.containerReference.getMaxCPRemaining(this);
	}
}

module.exports = UseGroup;