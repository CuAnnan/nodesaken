let XPPurchasable = require('./XPPurchasable');

class Merit extends XPPurchasable
{
	constructor(name, possibleLevels)
	{
		super(name);
		this.possibleLevels = possibleLevels;
	}
}