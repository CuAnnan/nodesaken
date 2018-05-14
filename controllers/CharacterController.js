let Controller = require('./Controller'),
	ForsakenCharacter = require('../character model/ForsakenCharacter.js'),
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
		
		console.log(req.body);
		
		let toon = new ForsakenCharacter(
			req.body.name?req.body.name:'Untitled Character',
			req.body.auspice?req.body.auspice:'',
			req.body.tribe?req.body.tribe:''
		);
		
		let character = await Character.create({
			owner:user,
			name:toon.name,
			auspice:toon.auspice,
			tribe:toon.tribe,
			json:toon.toJSON()
		});
		
		res.json({
			success:true,
			_id:character.reference
		});
	}
	
	static async fetchAction(req, res, next)
	{
		let user = await Controller.getLoggedInUser(req);
		let entity = await Character.findOne({
			owner:user,
			reference: req.params.reference
		}).populate('owner');
		
		entity.player = entity.owner.displayName+'#'+entity.owner.reference;
		
		let character = new ForsakenCharacter(entity);
		res.render('characters/fetch', {entity:entity, character:character});
	}
}

module.exports = CharacterController;