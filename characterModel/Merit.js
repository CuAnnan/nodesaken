'use strict';
let XPPurchasable = require('./XPPurchasable');

class Merit extends XPPurchasable
{
	constructor(name, data)
	{
		super(name);
		this.xpCost = 1;
		this.levels = data.levels;
		this.prerequisites = data.prerequisites;
		this.specific = data.specific;
		this.multiple = data.multiple;
		this.effects = data.effects;
		this.creationOnly = data.creationOnly;
		this.modifiers = data.modifiers;
		this.exclusiveTo = data.exclusiveTo;
		this.venue = data.venue;
		this.specification = null;
		this.loadJSON(data);
	}
	
	loadJSON(data)
	{
		this.specification = data.specification;
		super.loadJSON(data);
	}

	get modifier()
	{
		if(this.modifiers)
		{
			return this.modifiers[this.levels.indexOf(this.score)];
		}
		return this.score;
	}
	
	setSpecification(specification)
	{
		this.specification = specification;
	}
	
	get displayName()
	{
		let text = this.name;
		if(this.specification)
		{
			text += ' ('+this.specification+')';
		}
		return text;
	}
	
	toJSON()
	{
		let json = super.toJSON();
		json.specification = this.specification;
		json.specificMechanics = this.specificMechanics;
		return json;
	}
}


module.exports = Merit;