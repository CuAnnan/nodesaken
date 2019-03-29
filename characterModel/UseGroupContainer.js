'use strict';
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
		this.items = [];
	}

	get costs()
	{
		let data = {}
		for(let useGroup of this.titles)
		{
			data[useGroup] = this.useGroups[useGroup].costs;
		}
		return data;
	}
	
	toJSON()
	{
		let json = [];
		for(let i in this.useGroups)
		{
			json = json.concat(this.useGroups[i].toJSON());
		}
		return json;
	}
	
	addToUseGroup(name, thing)
	{
		if(!this.useGroups[name])
		{
			this.useGroups[name] =  new UseGroup(name, this);
		}
		this.items.push(thing);
		this.useGroups[name].add(thing);
	}
	
	getUseGroup(name)
	{
		return this.useGroups[name];
	}
	
	getUseGroupsArray()
	{
		let groupsArray= [];
		
		for(let i in this.useGroups)
		{
			let useGroup = this.useGroups[i];
			groupsArray.push(useGroup);
		}
		return groupsArray;
	}
	
	sortByCP()
	{
		let order = this.getUseGroupsArray();
		order.sort((a, b)=>{return (b.cost.cp - a.cost.cp)});
		return order;
	}
	
	sortByLevel()
	{
		let order = this.getUseGroupsArray();
		order.sort((a, b)=>{return ((b.cost.cp + b.cost.xp)- (a.cost.cp + a.cost.xp))});
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
	
	balance()
	{
		let orderedGroups = this.sortByLevel(),
			cpAmountValues = Object.values(this.cpAmounts),
			groupPreferenceNames = Object.keys(this.cpAmounts);
		
		for(let i in orderedGroups)
		{
			let group = orderedGroups[i],
				cost = group.cost,
				cpCost = cost.cp,
				cpDifference = cpAmountValues[i] - cpCost;
			if(cost.xp)
			{
				group.convertXPToSP(cpDifference);
			}
		}
	}
}

module.exports =  UseGroupContainer;