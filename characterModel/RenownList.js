let UseGroup = require('./UseGroup'),
	Renown = require('./Renown'),
	auspiceRenowns = {'Cahalith':'Glory', 'Elodoth':'Honor', 'Irraka':'Cunning', 'Ithaeur':'Wisdom','Rahu':'Purity'},
	tribalRenowns = {'Bone Shadows':'Wisdom', 'Hunters in Darkness':'Purity', 'Storm Lords':'Honor', 'Blood Talons':'Glory', 'Iron Masters':'Cunning'};
class RenownList extends UseGroup
{
	constructor()
	{
		super();
		let renowns = ['Cunning','Glory', 'Honor', 'Purity', 'Wisdom'];
		this.items = {};
		for(let renown of renowns)
		{
			this.addRenown(new Renown(renown));
		}
	}
	
	getRenownByName(name)
	{
		return this.items[name];
	}
	
	addRenown(renown)
	{
		renown.useGroup = this;
		this.items[renown.name] = renown;
	}
	
	setAuspice(auspice)
	{
		let renowns = Object.values(this.items);
		for(let renown of renowns)
		{
			renown.auspicious = renown.name == auspiceRenowns[auspice];
		}
		return this;
	}
	
	setTribe(tribe)
	{
		let renowns = Object.values(this.items);
		for(let renown of renowns)
		{
			//console.log(renown, renown.name, tribalRenowns[tribe]);
			renown.tribal = renown.name == tribalRenowns[tribe];
		}
		return this;
	}
	
	get cpRemaining()
	{
		let cpRemaining = 1;
		let renowns= Object.values(this.items);
		for(let renown of renowns)
		{
			cpRemaining -= renown.cost.cp;
		}
		return cpRemaining;
	}
	
	
	balanceCP()
	{
		let cpRemaining = this.cpRemaining;
		for(let i = 0; i < this.count && cpRemaining > 0; i++)
		{
			let renown = this.items[i];
			if(renown.xpLevels > 0)
			{
				cpRemaining = merit.convertXPToSP(cpRemaining);
			}
		}
		
	}
}

module.exports = RenownList;