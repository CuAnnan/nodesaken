let Controller = require('./Controller'),
	ForsakenCharacter = require('../characterModel/ForsakenCharacter.js'),
	User = require('../schemas/UserSchema'),
	Character= require('../schemas/CharacterSchema');

class CharacterController extends Controller
{
	static async indexAction(req, res, next)
	{
		let user = await User.find({email:req.session.user.email});
		let characters = await Character.find({owner:user});
		
		res.render('characters/index', {characters:characters});
	}
	
	static async newCharacterAction(req, res, next)
	{
		let user = await Controller.getLoggedInUser(req);
		let toon = new ForsakenCharacter(req.body);
		let character = await Character.create({
			owner:user,
			name:toon.name,
			auspice:toon.auspice,
			tribe:toon.tribe,
			json:toon.toJSON()
		});
		res.json({
			success:true,
			reference:character.reference
		});
	}
	
	static async fetchCharacterEntityByReference(user, reference)
	{
		let entity = await Character.findOne({
			owner:user,
			reference: reference
		}).populate('owner');
		entity.player = entity.owner.displayName+'#'+entity.owner.reference;
		
		return entity;
	}
	
	static async fetchAction(req, res, next)
	{
		let user = await Controller.getLoggedInUser(req),
			entity = await CharacterController.fetchCharacterEntityByReference(user, req.params.reference),
			character = new ForsakenCharacter(entity);
		character.loadJSON(entity.json);
		res.render('characters/fetch', {entity:entity, character:character});
	}
	
	static async saveCharacterAction(req, res, next)
	{
		try
		{
			let user = await Controller.getLoggedInUser(req),
				entity = await CharacterController.fetchCharacterEntityByReference(user, req.body.json.reference);
			entity.json = req.body.json;
			await entity.save();
			res.json({
				success:true
			});
		}
		catch(e)
		{
			res.json({
				success:false
			});
		}
	}
}

module.exports = CharacterController;