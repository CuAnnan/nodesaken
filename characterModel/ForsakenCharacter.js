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
		json.reference = this.reference;
		return json;
	}
}

module.exports = ForsakenCharacter;