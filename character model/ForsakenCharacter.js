let Character = require('./Character');

class ForsakenCharacter extends Character
{
	constructor()
	{
		super();
		this.formMods = {
			hishu:{perception:1},
			dalu:{strength:1, stamina:1, manipulation:-1, size:1, speed:1, perception:2},
			gauru:{strength:3, dexterity:1, stamina:2, size:2, speed:4, perception:3},
			urshul:{strength:2, dexterity:2, stamina:2, manipulation:-1, size:1, perception: 3},
			urhan:{dexterity:2, stamina:1, manipulation: -1, size: -1, speed: 5, perception: 4}
		}
	}
}

module.exports = ForsakenCharacter;