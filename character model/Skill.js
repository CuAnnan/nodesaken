let XPPurchasable = require('./XPPurchasable');

class Skill extends XPPurchasable
{
	constructor(name)
	{
		super(name);
		this.xpCost = 2;
		this.specialities = [];
	}
	
	get penalty()
	{
		return this.useGroupReference.penalty;
	}
	
	loadJSON(json)
	{
		super.loadJSON(json);
		this.specialities = json.specialties;
	}
	
	toJSON()
	{
		let json = super.toJSON();
		json.specialities = this.specialities;
		return json;
	}
	
	addSpeciality(specialityName)
	{
		this.specialities.push(specialityName);
	}
}

module.exports = Skill;