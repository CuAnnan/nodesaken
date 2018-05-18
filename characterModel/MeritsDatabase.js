let Merit = require('./Merit'),
	StyleIndividualMerit = require('./StyleIndividualMerit'),
	FightingStyle = require('./FightingStyle');

let MeritsDatabase = {
	data:[], searchable:{}, ordered:{}, toon:null,
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
				let merit = data[type][i];
				if(this.searchable[merit.name])
				{
					this.reconcileMerits(this.searchable[merit.name], merit);
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
		// the only time we're worried about reconciling merits is when it's a fighting style
		// so we need to add new maneuvers
		for(let maneuver of newMerit.maneuvers)
		{
			extantMerit.maneuvers.push(maneuver);
		}
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
		else if(!data.maneuvers)
		{
			return new StyleIndividualMerit(name, data);
		}
		else
		{
			return new FightingStyle(name, data);
		}
	},
	listAvailable:function()
	{
		let available = {};
		for(let i in this.ordered)
		{
			available[i] = [];
			for (let merit of (this.ordered[i]))
			{
				if(merit.prerequisites)
				{
					console.log(merit.prerequisites);
				}
				else
				{
					available[i].push(merit)
				}
			}
		}
		return available;
	},
	setToon:function(toon)
	{
		this.toon = toon;
	}
};

module.exports = MeritsDatabase;