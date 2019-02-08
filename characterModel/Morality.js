'use strict';
let XPPurchasable = require('./XPPurchasable');

class Morality extends XPPurchasable
{
	constructor(name)
	{
		super(name);
		this.name = name;
		
	}
	
	addBreakingEvent()
	{
	
	}
}

module.exports = Morality;