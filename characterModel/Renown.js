let XPPurchasable = require('./XPPurchasable');

class Renown extends XPPurchasable
{
	constructor(name)
	{
		super(name);
		this.xpCost = 3;
		this.auspicious = false;
		this.tribal = false;
	}
	
	get score()
	{
		return this.xpLevels + this.cpLevels + (this.auspicious?1:0) + (this.tribal?1:0);
	}
	
	toJSON()
	{
		let json = super.toJSON();
		json.auspicious = true;
		json.tribal = true;
		return json;
	}
}

module.exports = Renown;