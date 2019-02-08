'use strict';
let XPPurchasable = require('./XPPurchasable');

class Attribute extends XPPurchasable
{
	constructor(name)
	{
		super(name);
		this.min = 1;
		this.xpCost = 4;
	}
}

module.exports = Attribute;