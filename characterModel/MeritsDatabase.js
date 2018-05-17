let Merit = require('./Merit'),
	StyleIndividualMerit = require('./StyleIndividualMerit'),
	FightingStyle = require('./FightingStyle');

module.exports = {
	data:[], searchable:{}, ordered:{},
	reset:function()
	{
		this.data = [];
	},
	load:function(data)
	{
		for(let type in data)
		{
			if(!this.ordered[type])
			{
				this.ordered[type] = [];
			}
			
			for(let i in data[type])
			{
				
				let merit = data[type][i],
					test = new Merit(merit.name, merit);
				if(this.searchable[merit.name])
				{
					this.searchableMerits[merit.name] = this.reconcileMerits(this.searchable[merit.name], merit);
				}
				else
				{
					this.ordered[type].push(merit);
					this.data.push(merit);
					this.searchable[merit.name] = merit;
				}
			}
		}
	},
	reconcileMerits(extantMerit, newMerit)
	{
	
	},
	list:function()
	{
		return this.data;
	},
	listOrdered:function()
	{
		return this.ordered;
	},
	fetch:function(name)
	{
		let data = this.searchable[name];
		if(!data.styleTags)
		{
			return new Merit(name, data);
		}
		else if(!merit.maneuvers)
		{
			return new StyleIndividualMerit(name, data);
		}
		else
		{
			return new FightingStyle(name, data);
		}
	}
};