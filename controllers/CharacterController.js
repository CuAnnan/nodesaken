let Controller = require('./Controller'),
	ForsakenCharacter = require('../character model/ForsakenCharacter.js');

class CharacterController extends Controller
{
	async indexAction(req, res, next)
	{
		res.render('sheets/index');
	}
	
	async testUI(req, res, next)
	{
		let c = new ForsakenCharacter();
		res.render('sheets/characterUI', {'character':c});
	}
}

module.exports = new CharacterController();