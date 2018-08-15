let Merit = require('./Merit');

class ProfessionalTraining extends Merit
{
	constructor(name, data)
	{
		super(name, data);
		this.assetSkills = data.assetSkills?data.assetSkills:[];
		this.contacts = data.contacts?data.contacts:[];
		this.specialities = data.specialities?data.specialities:[];
		this.freeLevel = data.freeLevel?data.freeLevel:null;
	}
	
	loadJSON(data)
	{
		super.loadJSON(data);
		this.assetSkills = data.assetSkills?data.assetSkills:[];
		this.contacts = data.contacts?data.contacts:[];
		this.specialities = data.specialities?data.specialities:[];
		this.freeLevel = data.freeLevel?data.freeLevel:null;
	}
	
	toJSON()
	{
		let json = super.toJSON();
		json.assetSkills = this.assetSkills;
		json.contacts = this.contacts;
		json.specialities = this.specialities;
		json.freeLevel = this.freeLevel;
		return json;
	}
	
	setAssetSkill(index, skill)
	{
		let oldSkill = this.assetSkills[index]?this.assetSkills[index]:null;
		this.assetSkills[index] = skill;
		return oldSkill;
	}
	
	setSpeciality(index, skill, speciality)
	{
		this.specialities[index] = this.specialities[index]?this.specialities[index]:{};
		this.specialities[index].skill = skill;
		this.specialities[index].skill = speciality;
	}
	
	setContact(index, contact)
	{
		this.contacts[index] = contact;
	}
}

module.exports = ProfessionalTraining;