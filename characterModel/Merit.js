let XPPurchasable = require('./XPPurchasable');

class Merit extends XPPurchasable
{
	constructor(name, data)
	{
		super(name);
		this.xpCost = 1;
		this.levels = null;
		this.prerequisites = [];
		this.specific = data.specific;
		this.multiple = data.multiple;
		this.effects = data.effects;
		this.creationOnly = data.creationOnly;
		this.modifiers = [];
		this.exclusiveTo = data.exclusiveTo;
		this.venue = data.venue;
		this.specification = data.specification;
	}
	
	setSpecification(specification)
	{
		this.specification = specification;
	}
}


module.exports = Merit;