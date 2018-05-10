let UseGroup = require('./UseGroup');

class UseGroupContainer
{
	constructor(type, cpAmounts)
	{
		this.type = type;
		this.cpAmounts = cpAmounts;
		this.things = {'Mental':null, 'Physical':null, 'Social':null};
	}
	
	addToUseGroup(type, thing)
	{
		if(!this.things[type])
		{
			this.things = new UseGroup(type, this);
		}
		this.things.add(thing);
	}
	
	get groupTitles()
	{
		let titles = [];
		for(let i in this.things)
		{
			titles.push(i);
		}
		return titles;
	}
}

module.exports =  UseGroupContainer;