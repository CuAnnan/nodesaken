'use strict';
let User = require('../schemas/UserSchema');

class Controller
{
	static async getUserByEmail(email)
	{
		return await User.findOne({email:email});
	}
	
	static async getSessionUser(sessionUser, returnProperties, populate = {})
	{
		let user, userSearch= {email:sessionUser.email};
		
		if(returnProperties)
		{
			user = await User.findOne(userSearch, returnProperties);
		}
		else
		{
			user = await User.findOne(userSearch);
		}
		
		if(populate)
		{
			for(let i in populate)
			{
				user.populate(i, populate[i]);
			}
		}
		
		return user;
	}
	
	static async getLoggedInUser(req, returnProperties, populate)
	{
		if (!req.session.user)
		{
			return {_id:null};
		}
		
		return Controller.getSessionUser(req.session.user, returnProperties, populate);
	}

	static getHost(req)
	{
		return `${req.protocol}://${req.get('Host')}`;
	}
}

module.exports = Controller;