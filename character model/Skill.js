let XPPurchasable = require('./XPPurchasable');

class Skill extends XPPurchasable
{
	constructor(name)
	{
		super(name);
		this.xpCost = 2;
	}
	
	
}

module.exports = Skill;