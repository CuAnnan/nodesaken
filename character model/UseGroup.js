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
		this.contents = [];
		this.cost = {cp:0, xp:0};
	}
	
	add(thing)
	{
		this.contents.push(thing);
		this.useGroup = this;
	}
	
	update()
	{
		this.cost = {cp:0, xp:0};
		for(let thing of this.contents)
		{
			this.cost.cp += thing.cost.cp;
			this.cost.xp += thing.cost.xp;
		}
	}
}

module.exports = UseGroup;