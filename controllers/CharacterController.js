"use strict";
let Controller = require('./Controller'),
	ForsakenCharacter = require('../characterModel/Forsaken/ForsakenCharacter'),
	User = require('../schemas/UserSchema'),
	Character= require('../schemas/CharacterSchema'),
	CharacterAPIKey = require('../schemas/CharacterAPIKeySchema'),
	MeritsDatabase = require('../characterModel/MeritsDatabase'),
	ObjectCache = require('objectcache');

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
		user.characters.push(character);
		user.save();
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

	static buildCharacterFromEntity(entity)
	{
		let character = new ForsakenCharacter(entity),
			gifts = require('../public/js/GiftsDB/Forsaken');

		MeritsDatabase.setToon(character);
		MeritsDatabase.loadFromFiles();
		character.loadShadowGiftsJSON(gifts.shadow);
		character.loadJSON(entity.json);
		return character;
	}
	
	static async fetchAction(req, res, next)
	{
		let user = await Controller.getLoggedInUser(req),
			entity = await CharacterController.fetchCharacterEntityByReference(user, req.params.reference),
			character = CharacterController.buildCharacterFromEntity(entity);
		
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

	static async deleteAction(req, res, next)
	{
		try
		{
			let user = await Controller.getLoggedInUser(req);

			await Character.deleteOne({owner:user,reference: req.params.reference});

			res.json({
				success:true
			});
		}
		catch(e)
		{
			console.log(e);
			res.json({
				success:false,
				exception: e
			});
		}
	}

	static async generateAPIKey(req, res, next)
	{
		try
		{
			let user = await Controller.getLoggedInUser(req),
				entity = await CharacterController.fetchCharacterEntityByReference(user, req.body.json.reference);

		}
		catch(e)
		{
			console.log(e);
			res.json({
				success:false
			})
		}
	}

	static async getAPIKeys(req, res, next)
	{
		try
		{
			let user = await Controller.getLoggedInUser(req),
				entity = await CharacterController.fetchCharacterEntityByReference(user, req.params.reference);

			res.json({apiKeys:entity.apiKeys});
		}
		catch(e)
		{
			res.json({
				error:e
			})
		}
	}
}

module.exports = CharacterController;