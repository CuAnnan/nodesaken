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
	}
	
	addManeuver(level, maneuverName)
	{
		if(!this.maneuvers[level])
		{
			this.maneuvers[level] = [];
		}
		this.maneuvers[level].push(maneuverName);
	}
}

module.exports = FightingStyle;