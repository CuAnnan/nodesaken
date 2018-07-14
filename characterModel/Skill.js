let XPPurchasable = require('./XPPurchasable');

class Skill extends XPPurchasable
{
	constructor(name)
	{
		super(name);
		this.xpCost = 2;
		this.specialties = [];
	}
	
	get penalty()
	{
		return this.useGroup.penalty;
	}
	
	loadJSON(json)
	{
		super.loadJSON(json);
		this.specialties = json.specialties?json.specialties:[];
	}
	
	toJSON()
	{
		let json = super.toJSON();
		json.specialties = this.specialties;
		return json;
	}
	
	addSpecialty(specialty)
	{
		this.specialties.push(specialty);
	}
	
	replaceSpecialty(oldSpecialty, newSpecialty)
	{
		this.specialties[this.specialties.indexOf(oldSpecialty)] = newSpecialty;
	}
}

module.exports = Skill;