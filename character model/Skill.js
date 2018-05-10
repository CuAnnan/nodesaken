let XPPurchasable = require('./XPPurchasable');

class Skill extends XPPurchasable
{
	constructor(name)
	{
		super(name);
		this.xpCost = 2;
	}
	
	get penalty()
	{
		return this.useGroupReference.penalty;
	}
	
	
}

module.exports = Skill;