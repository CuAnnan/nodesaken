let SupernaturalTemplate = require('../SupernaturalTemplate'),
	PrimalUrge = require('./PrimalUrge'),
	RenownList = require('./RenownList'),
	GiftListsContainer = require('./Gifts/GiftListsContainer');

let primalUrgeTable = {
	"1":{"essence":10,"essencePerTurn":1,"regenerationPerTurn":1,"basuImTime":10,"feedingRestriction":"None","huntTime":"3 months","lunacyPenalty":0,"trackingBonus":0},
	"2":{"essence":11,"essencePerTurn":2,"regenerationPerTurn":1,"basuImTime":10,"feedingRestriction":"Meat","huntTime":"3 months","lunacyPenalty":0,"trackingBonus":0},
	"3":{"essence":12,"essencePerTurn":3,"regenerationPerTurn":1,"basuImTime":15,"feedingRestriction":"Meat","huntTime":"1 month","lunacyPenalty":0,"trackingBonus":0},
	"4":{"essence":13,"essencePerTurn":4,"regenerationPerTurn":2,"basuImTime":20,"feedingRestriction":"Raw meat","huntTime":"1 month","lunacyPenalty":-2,"trackingBonus":1},
	"5":{"essence":14,"essencePerTurn":5,"regenerationPerTurn":2,"basuImTime":30,"feedingRestriction":"Raw meat","huntTime":"3 weeks","lunacyPenalty":-2,"trackingBonus":1},
	"6":{"essence":15,"essencePerTurn":6,"regenerationPerTurn":3,"basuImTime":60,"feedingRestriction":"Carnivore","huntTime":"3 weeks","lunacyPenalty":-2,"trackingBonus":2},
	"7":{"essence":20,"essencePerTurn":7,"regenerationPerTurn":3,"basuImTime":120,"feedingRestriction":"Carnivore","huntTime":"1 week","lunacyPenalty":-2,"trackingBonus":2},
	"8":{"essence":30,"essencePerTurn":8,"regenerationPerTurn":4,"basuImTime":180,"feedingRestriction":"Essence","huntTime":"1 week","lunacyPenalty":-3,"trackingBonus":3},
	"9":{"essence":50,"essencePerTurn":10,"regenerationPerTurn":5,"basuImTime":360,"feedingRestriction":"Essence","huntTime":"3 days","lunacyPenalty":-4,"trackingBonus":3},
	"10":{"essence":75,"essencePerTurn":15,"regenerationPerTurn":6,"basuImTime":720,"feedingRestriction":"Essence","huntTime":"3 days","lunacyPenalty":-5,"trackingBonus":4}
};

class ForsakenCharacter extends SupernaturalTemplate
{
	constructor(data)
	{
		super(data);
		this.blood = data.blood;
		this.bone = data.bone;
		this.auspice = data.auspice;
		this.trigger = data.trigger;
		this.reference = data.reference;
		this.touchstones = {
			'flesh':(data.touchstones && data.touchstones.flesh)?data.touchstones.flesh:'',
			'spirit':(data.touchstones && data.touchstones.spirit)?data.touchstones.spirit:'',
		};
		
		this.primalUrge = new PrimalUrge(this.merits);
		this.lookups['Primal Urge'] = this.primalUrge;
		
		this.renown = new RenownList().setAuspice(this.auspice).setTribe(this.tribe);
		this.setTribe(data.tribe);
		this.setAuspice(data.auspice);
		
		this.gifts = new GiftListsContainer().setAuspice(this.auspice).setTribe(this.tribe);
		
		this.formMods = {
			hishu: {mechanical:{perception: 1}},
			dalu: {mechanical:{strength: 1, stamina: 1, manipulation: -1, size: 1, speed: 1, perception: 2}},
			gauru: {mechanical:{strength: 3, dexterity: 1, stamina: 2, size: 2, speed: 4, perception: 3}, informative:{initiative:1}},
			urshul: {mechanical:{strength: 2, dexterity: 2, stamina: 2, manipulation: -1, speed: 7, size: 1, perception: 3}, informative:{initiative:2}},
			urhan: {mechanical:{dexterity: 2, stamina: 1, manipulation: -1, size: -1, speed: 5, perception: 4}, informative:{initiative:2}},
		};
	}
	
	getResistance ()
	{
		return this.primalUrge;
	}
	
	setBlood(blood)
	{
		this.blood = blood;
	}
	
	setBone(bone)
	{
		this.bone = bone;
	}
	
	setAuspice(auspice)
	{
		this.auspice = auspice;
		this.renown.setAuspice(auspice);
	}
	
	setTribe(tribe)
	{
		this.tribe = tribe;
		this.renown.setTribe(tribe);
	}
	
	get morality()
	{
		return this.harmony;
	}
	
	set morality(value)
	{
		this.harmony = value;
	}
	
	getRenownByName(name)
	{
		return this.renown.getRenownByName(name);
	}
	
	setRenownLevel(name, value)
	{
		this.renown.setRenownLevel(name, value);
	}
	
	toJSON()
	{
		let json = super.toJSON();
		json.personalDetails = {name:this.name, tribe:this.tribe, auspice:this.auspice};
		json.reference = this.reference;
		json.harmony = this.harmony;
		json.touchstones = {
			flesh:this.touchstones.flesh,
			spirit:this.touchstones.spirit
		};
		json.primalUrge = this.primalUrge.toJSON();
		json.renown = this.renown.toJSON();
		
		return json;
	}
	
	loadJSON(data)
	{
		super.loadJSON(data);
		this.json = data.json;
		this.primalUrge.loadJSON(data.primalUrge?data.primalUrge:{});
		this.touchstones = data.touchstones?data.touchstones:{flesh:'', spirit:''};
		this.harmony = data.harmony?parseInt(data.harmony):7;
		this.renown.loadJSON(data.renown?data.renown:{});
		this.calculateDerived();
	}
	
	loadShadowGiftsJSON(json)
	{
		this.gifts.loadShadowGiftsFromJSON(json);
	}
	
	get availableShadowGifts()
	{
		return this.gifts.fetchAvailableShadowGiftFacets(this.renown.unlockedRenown);
	}
	
	buyShadowGiftFacet(giftShorthand, renown)
	{
		this.gifts.unlockShadowGiftFacet(giftShorthand, renown);
	}
	
	getDefense(form = 'hishu')
	{
		let dexFormMod = this.formMods[form].mechanical.dexterity?this.formMods[form].mechanical.dexterity:0;
		
		let defense = Math.min(
			this.addScores('Wits', this.defenseSkill),
			this.addScores('Dexterity', this.defenseSkill, dexFormMod)
		);
		
		return defense;
	}
	
	calculateDerived()
	{
		super.calculateDerived();
		
		this.lookups['harmony'] = {score:this.harmony};
		let primalUrgeRow = primalUrgeTable[this.primalUrge.score];
		this.essenceMax = primalUrgeRow.essence;
	}
	
	get firstTenShadowFacets()
	{
		return this.gifts.firstTenShadowFacets;
	}
	
	get firstTenWolfFacets()
	{
		return this.gifts.firstTenWolfFacets;
	}
}

module.exports = ForsakenCharacter;