let Character = require('./Character');

class ForsakenCharacter extends Character
{
	constructor(data)
	{
		super(data);
		this.auspice = data.auspice;
		this.tribe = data.tribe;
		this.reference = data.reference;
		
		this.formMods = {
			hishu: {mechanical:{perception: 1}},
			dalu: {mechanical:{strength: 1, stamina: 1, manipulation: -1, size: 1, speed: 1, perception: 2}},
			gauru: {mechanical:{strength: 3, dexterity: 1, stamina: 2, size: 2, speed: 4, perception: 3}, informative:{initiative:1}},
			urshul: {mechanical:{strength: 2, dexterity: 2, stamina: 2, manipulation: -1, speed: 7, size: 1, perception: 3}, informative:{initiative:2}},
			urhan: {mechanical:{dexterity: 2, stamina: 1, manipulation: -1, size: -1, speed: 5, perception: 4}, informative:{initiative:2}},
		};
		// these have no mechanical effect. They're on the character sheet as a tooltip, but they are a result of
		// increased derived stats, not further increases
		
	}
	
	toJSON()
	{
		let json = super.toJSON();
		json.personalDetails = {name:this.name, tribe:this.tribe, auspice:this.auspice};
		json.reference = this.reference;
		return json;
	}
	
	getDefense(form = 'hishu')
	{
		
		let skill = 'Athletics';
		if(this.hasMerit('Defensive Fighting - Brawl') && (this.lookups.Brawl.score > this.lookups.Athletics.score))
		{
			skill = 'Brawl';
		}
		else if(this.hasMerit('Defensive Fighting - Weaponry') && (this.lookups.Weaponry.score > this.lookups.Athletics.score))
		{
			skill = 'Weaponry';
		}
		
		let dexFormMod = this.formMods[form].mechanical.dexterity?this.formMods[form].mechanical.dexterity:0;
		
		let defense = Math.min(
			this.addScores('Wits', skill),
			this.addScores('Dexterity', skill, dexFormMod)
		);
		
		return defense;
	}
}

module.exports = ForsakenCharacter;