'use strict';
let StyleIndividualMerit = require('./StyleIndividualMerit');

class FightingStyle extends StyleIndividualMerit
{
	constructor(name, data)
	{
		super(name, data);
		this.maneuvers = {};
		for(let maneuver of data.maneuvers)
		{
			this.addManeuver(maneuver.level, maneuver.name)
		}
		this.styleTags = data.styleTags;
		this.crossLearnedManeuvers = [];
	}
	
	addManeuver(level, maneuverName)
	{
		if(!this.maneuvers[level])
		{
			this.maneuvers[level] = [];
		}
		this.maneuvers[level].push(maneuverName);
	}
	
	get learnedManeuvers()
	{
		let maneuvers = [];
		for (let i = 0; i < this.score; i++)
		{
			maneuvers.push(this.maneuvers[i]);
		}
		maneuvers = maneuvers.concat(this.crossLearnedManeuvers);
		return maneuvers;
	}
	
	toJSON()
	{
		let json = super.toJSON();
		json.crossLearnedManeuvers = this.crossLearnedManeuvers;
		return json;
	}
}

module.exports = FightingStyle;