let UseGroup = require('./UseGroup');

class UseGroupContainer
{
	constructor(type, cpAmounts)
	{
		this.type = type;
		cpAmounts = cpAmounts.sort((a, b)=>{return b - a});
		this.cpAmounts = {primary:cpAmounts[0],secondary:cpAmounts[1],tertiary:cpAmounts[2]};
		this.useGroups = {'Mental':null, 'Physical':null, 'Social':null};
		this.titles = ['Mental', "Physical", "Social"];
	}
	
	addToUseGroup(name, thing)
	{
		if(!this.useGroups[name])
		{
			this.useGroups[name] =  new UseGroup(name, this);
		}
		this.useGroups[name].add(thing);
	}
	
	getUseGroup(name)
	{
		return this.useGroups[name];
	}
	
	sortByCP()
	{
		let order = [];
		
		for(let i in this.useGroups)
		{
			let useGroup = this.useGroups[i];
			order.push(useGroup);
		}
		order.sort((a, b)=>{return b.cost.cp - a.cost.cp});
		return order;
	}
	
	getMaxCPRemaining(useGroup)
	{
		let canBePrimary = true,
			canBeSecondary = true;
		for(let i in this.useGroups)
		{
			if(i !== useGroup.name)
			{
				if(this.useGroups[i].cost.cp > this.cpAmounts.secondary)
				{
					canBePrimary = false;
				}
				else if(this.useGroups[i].cost.cp > this.cpAmounts.tertiary)
				{
					canBeSecondary = false;
				}
			}
		}
		let maxCP = this.cpAmounts.tertiary;
		if(canBePrimary)
		{
			maxCP = this.cpAmounts.primary;
		}
		else if(canBeSecondary)
		{
			maxCP = this.cpAmounts.secondary;
		}
		
		let available = maxCP - useGroup.cost.cp;
		return available;
	}
}

module.exports =  UseGroupContainer;