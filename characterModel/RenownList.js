let UseGroup = require('./UseGroup'),
	Renown = require('./Renown'),
	auspiceRenowns = {'cahalith':'Glory', 'elodoth':'Honor', 'irraka':'Cunning', 'ithaeur':'Wisdom','rahu':'Purity'},
	tribalRenowns = {};
class RenownList extends UseGroup
{
	constructor()
	{
		super();
		let renowns = ['Cunning','Glory', 'Honor', 'Purity', 'Wisdom'];
		for(let renown of renowns)
		{
			this.addRenown(new Renown(renown));
		}
		this.items = {};

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
			renown.auspicious = renown.name == auspiceRenowns[auspice.toLowerCase()];
		}
	}
	
	setTribe(tribe)
	{
		let renowns = Object.values(this.items);
		for(let renown of renowns)
		{
			renown.tribal = renown.name == tribalRenowns[tribe.toLowerCase()];
		}
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