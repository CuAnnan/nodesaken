let XPPurchasable = require('../XPPurchasable');

class PrimalUrge extends XPPurchasable
{
	constructor(meritContainer)
	{
		super('Primal Urge');
		this.xpCost = 5;
		this.cpCost = 5;
		this.min = 1;
		this.max = 10;
		meritContainer.powerStat = this;
		this.useGroup = meritContainer;
	}
}

module.exports = PrimalUrge;