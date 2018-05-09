let Controller = require('./Controller'),
	Character = require('../character model/Character.js');

class CharacterController extends Controller
{
	async indexAction(req, res, next)
	{
		res.render('sheets/index');
	}
	
	async testUI(req, res, next)
	{
		let c = new Character();
		res.render('sheets/characterUI', {'character':c});
	}
}

module.exports = new CharacterController();