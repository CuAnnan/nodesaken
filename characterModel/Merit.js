let XPPurchasable = require('./XPPurchasable');

class Merit extends XPPurchasable
{
	constructor(name, possibleLevels)
	{
		super(name);
		this.possibleLevels = possibleLevels;
		this.xpCost = 1;
	}
	
	setLevel(level)
	{
		/**
		 * Unlike most XPPurchasables, it is possible to pick a nonsensical level of a merit.
		 * if the available values are 1, 3, 5 and you press 2 then are you looking to buy level 1 or 3.
		 */
	}
}