let Merit = require('./Merit'),
	StyleIndividualMerit = require('./StyleIndividualMerit'),
	FightingStyle = require('./FightingStyle'),
	MeritChecker = require('./MeritChecker');

let MeritsDatabase = {
	data:[], searchable:{}, ordered:{}, toon:null, availableMerits:{},
	reset:function()
	{
		this.data = [];
	},
	load:function(data, source)
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
				merit.source = source;
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
		this.update();
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
	update:function()
	{
		let available = {};
		for(let i in this.ordered)
		{
			available[i] = [];
			for (let merit of this.ordered[i])
			{
				let result = MeritChecker.validates(this.toon, merit);
				if(result.validates)
				{
					available[i].push(merit);
				}
				else
				{
					/*
					console.log(merit.name + " doesn't meet prereqs");
					console.log(result.failurePoints);
					*/
				}
			}
		}
		this.available = available;
	},
	setToon:function(toon)
	{
		this.toon = toon;
		this.toon.addEventListener('changed', ()=>{
			this.update();
		});
	},
	listAvailable:function()
	{
		return this.available;
	}
};

module.exports = MeritsDatabase;