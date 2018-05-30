let Merit = require('./Merit'),
	StyleIndividualMerit = require('./StyleIndividualMerit'),
	FightingStyle = require('./FightingStyle'),
	MeritChecker = require('./MeritChecker'),
	meritDBFiles = [
		'ChroniclesOfDarkness.json',
		'13Precinct.json',
		'HurtLocker.json',
		'DarkEras.json',
		'Forsaken.json',
		'ThePack.json',
	],
	fs = require('fs');

let MeritsDatabase = {
	data:[], searchable:{}, ordered:{}, toon:null, availableMerits:{},dataLoaded:false,
	reset:function()
	{
		this.data = [];
	},
	addToOrder:function(source)
	{
		this.ordered[source] = [];
	},
	load:function(data, source)
	{
		this.data[source] = [];
		
		for(let type in data)
		{
			this.ordered[source][type] = [];
			
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
					this.ordered[source][type].push(merit);
					this.data[source].push(merit);
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
	update:function()
	{
		let available = {};
		for(let source in this.ordered)
		{
			for(let i in this.ordered[source])
			{
				available[i] = [];
				for (let merit of this.ordered[source][i])
				{
					let result = MeritChecker.validates(this.toon, merit);
					if (result.validates)
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
	},
	loadRemote:function()
	{
		let requests = [];
		
		for(let i of meritDBFiles)
		{
			MeritsDatabase.addToOrder(i);
			requests.push(
				$.get(`/js/MeritDB/${i}`).then((data)=>{MeritsDatabase.load(JSON.parse(data), i);})
			);
		}
		
		return Promise.all(requests).then(()=>{
			MeritsDatabase.update();
		});
	},
	loadFromFiles:function()
	{
		if(this.dataLoaded)
		{
			return;
		}
		for(let i of meritDBFiles)
		{
			MeritsDatabase.addToOrder(i);
			let file = fs.readFileSync(appRoot+'/public/js/MeritDB/'+i);
			let fileJSON = JSON.parse(file);
			MeritsDatabase.load(fileJSON, i);
		}
		MeritsDatabase.update();
		this.dataLoaded = true;
	}
};

module.exports = MeritsDatabase;