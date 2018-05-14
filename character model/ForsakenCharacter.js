let Character = require('./Character');

class ForsakenCharacter extends Character
{
	constructor(data)
	{
		super();
		this.name = data.name;
		this.auspice = data.auspice;
		this.tribe = data.tribe;
		this.player = data.player;
		this.loadJSON(data.json);
		this.formMods = {
			hishu:{perception:1},
			dalu:{strength:1, stamina:1, manipulation:-1, size:1, speed:1, perception:2},
			gauru:{strength:3, dexterity:1, stamina:2, size:2, speed:4, perception:3},
			urshul:{strength:2, dexterity:2, stamina:2, manipulation:-1, size:1, perception: 3},
			urhan:{dexterity:2, stamina:1, manipulation: -1, size: -1, speed: 5, perception: 4}
		}
	}
	
	toJSON()
	{
		let json = super.toJSON();
		json.personalDetails = {name:this.name, tribe:this.tribe, auspice:this.auspice};
		return json;
	}
}

module.exports = ForsakenCharacter;