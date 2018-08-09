let UseGroup = require('../UseGroup'),
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
		this.hsr = 1;
		for(let renown of renowns)
		{
			this.addRenown(new Renown(renown));
		}
	}
	
	updateHSR()
	{
		let totalRenown = 0;
		for(let renown of Object.values(this.items))
		{
			totalRenown += renown.score;
		}
		
		if(totalRenown > 3)
		{
			if(totalRenown < 8)
			{
				this.hsr = 2;
				return;
			}
			else if (totalRenown < 13)
			{
				this.hsr = 3;
				return;
			}
			else if(totalRenown < 19)
			{
				this.hsr = 4;
				return;
			}
			this.hsr = 5;
			return;
		}
		this.hsr = 1;
		return;
	}
	
	setRenownLevel(name, value)
	{
		this.items[name].score = value;
		this.updateHSR();
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
				cpRemaining = renown.convertXPToSP(cpRemaining);
			}
		}
	}
	
	loadJSON(json)
	{
		for(let renown of Object.values(json))
		{
			this.items[renown.name].loadJSON(renown);
		}
	}
	
	get unlockedRenown()
	{
		let unlocked = {};
		for(let renown of Object.values(this.items))
		{
			unlocked[renown.name] = renown.score > 0;
		}
		return unlocked;
	}
	
	getRemainingRenownPicks(renown)
	{
		return this.items[renown].remainingFreeFacets;
	}
	
	setGiftFacetFreePick(giftList, gift, renown, freePick)
	{
		this.items[renown].setGiftFacetFreePick(giftList, gift, freePick);
	}
}

module.exports = RenownList;