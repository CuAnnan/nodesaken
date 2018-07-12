let XPPurchasable = require('../XPPurchasable');

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
		return this.xpLevels + this.cpLevels + this.getFreeLevels();
	}
	
	getFreeLevels()
	{
		return 0 + (this.auspicious?1:0) + (this.tribal?1:0);
	}
	
	set score(level)
	{
		this.setScore(level);
	}
	
	toJSON()
	{
		let json = super.toJSON();
		return json;
	}
	
	loadJSON(json)
	{
		super.loadJSON(json);
	}
}

module.exports = Renown;