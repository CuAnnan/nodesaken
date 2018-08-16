let Merit = require('./Merit');

function defaultValue(a, b, def)
{
	return a?a:(b?b:def);
}

class ProfessionalTraining extends Merit
{
	constructor(name, data)
	{
		super(name, data);
		this.assetSkills = data.assetSkills?data.assetSkills:[];
		this.contacts = data.contacts?data.contacts:[];
		this.specialties = data.specialties?data.specialties:[];
		this.freeSkillLevel = data.freeSkillLevel?data.freeSkillLevel:null;
	}
	
	loadJSON(data)
	{
		super.loadJSON(data);
		this.assetSkills = data.assetSkills?data.assetSkills:[];
		this.contacts = data.contacts?data.contacts:[];
		this.specialties = data.specialties?data.specialties:[];
		this.freeSkillLevel = data.freeSkillLevel?data.freeSkillLevel:null;
	}
	
	toJSON()
	{
		let json = super.toJSON();
		json.assetSkills = this.assetSkills;
		json.contacts = this.contacts;
		json.specialties = this.specialties;
		json.freeSkillLevel = this.freeSkillLevel;
		return json;
	}
	
	setAssetSkill(index, skill)
	{
		let oldSkill = this.assetSkills[index]?this.assetSkills[index]:null;
		this.assetSkills[index] = skill;
		return oldSkill;
	}
	
	setSpeciality(index, data)
	{
		this.specialties[index] = this.specialties[index]?this.specialties[index]:{};
		this.specialties[index].skill = defaultValue(data.skill, this.specialties[index].skill, '');
		this.specialties[index].specialty = defaultValue(data.specialty, this.specialties[index].specialty, '');
	}
	
	setContact(index, contact)
	{
		this.contacts[index] = contact;
	}
	
	setFreeSkill(skill)
	{
		let oldSkill = this.freeSkillLevel?this.freeSkillLevel:null;
		this.freeSkillLevel = skill;
		return oldSkill;
	}
}

module.exports = ProfessionalTraining;