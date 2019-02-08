'use strict';
let Character = require('./Character'),
	SupernaturalMeritList = require('./SupernaturalMeritList');

class SupernaturalTemplate extends Character
{
	constructor(data)
	{
		super(data);
		this.merits = new SupernaturalMeritList();
	}
	
	
}

module.exports = SupernaturalTemplate;