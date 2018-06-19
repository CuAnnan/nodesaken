let Controller = require('./Controller'),
	validator = require('email-validator'),
	User = require('../schemas/UserSchema'),
	bcrypt = require('bcrypt'),
	fs = require('fs'),
	sendmail = require('sendmail')(),
	ejs = require('ejs'),
	shortid = require('shortid'),
	moment = require('moment');

function validatePassword(password)
{
	if(password.length < 8)
	{
		return 'Passwords must be at least 8 characters long';
	}
	else if(password.length < 13 && !(password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[^a-z^A-Z\d]/)))
	{
		return 'Passwords with fewer than 13 characters must have at least one upper case letter, one lower case letter, one number, and one character that is not a letter or number';
	}
	else if(password.length < 16 && !(password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/)))
	{
		return 'Passwords with fewer than 13 characters must have at least one upper case letter, one lower case letter, and one number';
	}
	else if(password.length < 20 && !(password.match(/[a-z]/) && password.match(/[A-Z]/)))
	{
		return 'Passwords with fewer than 13 characters must have at least one upper case letter, and one lower case letter';
	}
	return null;
}

class UserController extends Controller
{
	static async indexAction(req, res, next)
	{
		if(req.session.user)
		{
			return this.accountAction(req, res, next);
		}
		return this.registrationFormAction(req, res, next);
	}
	
	static async accountAction(req, res, next)
	{
		let user = await Controller.getLoggedInUser(req);
		console.log(user);
		res.render('users/accountDetails', {user:user});
		return;
	}
	
	static getFormFields(post)
	{
		let fields= {
			inputs: {
				'displayName': {
					name: 'displayName',
					type: 'text',
					label: 'Display name',
					sample: 'Bonkers McUserface',
					prepend: '<i class="fa fa-user" aria-hidden="true"></i>'
				},
				'email': {
					name: 'email',
					type: 'email',
					label: 'Email Address',
					sample: 'email@example.com',
					prepend: '@'
				},
				'password': {
					name: 'password',
					type: 'password',
					label: 'Password',
					prepend: '<i class="fa fa-key" aria-hidden="true"></i>',
					append: '<a href="#passwordModal" id="passwordModalLink" class="modalLink"><i class="fa fa-question-circle" aria-hidden="true">&nbsp;</i></a>'
				},
				'passwordConfirmation': {
					name: 'passwordConfirmation',
					type: 'password',
					label: 'Confirm Password',
					prepend: '<i class="fa fa-check" aria-hidden="true"></i>'
				},
				'discordUsername':{
					name:'discordUsername',
					type:'text',
					label:'Discord Username',
					prepend: '<i class="fab fa-discord" aria-hidden="true"></i>'
				}
			},
			checks: {
				"termsAndConditions": {name: "termsAndConditions"},
				"privacyPolicy": {name: "privacyPolicy"},
				"ageCheck": {name: "ageCheck"}
			},
			errors:0
		};
		
		if(post)
		{
			for(let i in fields.inputs)
			{
				if(!post[i])
				{
					if(fields.inputs[i])
					{
						fields.inputs[i].error = 'Field is required';
					}
					else
					{
						fields.checks[i].error = 'Field is required';
					}
					fields.errors++;
				}
				else
				{
					if(fields.inputs[i] && fields.inputs[i].type !== 'password')
					{
						fields.inputs[i].value = post[i];
					}
				}
			}
			if(!post.password == post.passwordConfirmation)
			{
				fields.password.error = 'Password texts do not match';
				fields.errors++;
			}
			let passwordError = validatePassword(post.password);
			if(passwordError)
			{
				fields.password.error = passwordError;
				fields.errors++;
			}
			if(!validator.validate(post.email))
			{
				fields.email.error = 'Email is not valid';
				fields.errors++;
			}
		}
		
		return fields;
	}
	
	
	
	static async registrationFormAction(req, res, next)
	{
		res.render('users/registrationForm', {form:UserController.getFormFields()});
		return;
	}
	
	static async updateLostPasswordDetails(user)
	{
		user.resetKey = shortid.generate();
		user.resetNeeded = true;
		user.resetRequested = Date.now();
		await user.save();
	}
	
	static async generateLostPasswordEmail(req, res, next)
	{
		try
		{
			let user = await Controller.getUserByEmail(req.body.email);
			if (user)
			{
				if(user.resetRequested)
				{
					let when = moment(user.resetRequested),
						now = moment(),
						days = when.diff(now, "days");
					if(days > 7)
					{
						await UserController.updateLostPasswordDetails(user);
					}
				}
				else
				{
					await UserController.updateLostPasswordDetails(user);
				}
				
				let template = fs.readFileSync('views/users/passwordEmail.ejs', 'utf8'),
					passwordResetLink = `${Controller.getHost(req)}/users/lostPassword/${user.resetKey}`,
					message = ejs.render(template, {link:passwordResetLink});
				
				sendmail(
					{
						from:'no-reply@sheets.so-4pt.net',
						to:user.email,
						subject:'Nodesaken Account Retrieval',
						html:message
					},
					function(err, reply)
					{
						console.log('Handling mail function callback');
						if(err)
						{
							console.log('Have an error');
							console.log(err && err.stack);
						}
						else
						{
							console.log("Don't have an error");
							console.log(reply);
						}
					}
				);
			}
			res.json({requestReceived:true});
		}
		catch(e)
		{
			console.log(e);
		}
	}
	
	static async displayLostPasswordForm(req, res, next)
	{
		let user = await User.findOne({resetKey:req.params.resetKey});
		if(user)
		{
			res.render('users/resetPassword', {user: user});
		}
		else
		{
			res.render('users/noUserFound');
		}
		return;
	}
	
	static async updatePassword(req, res, next)
	{
		if(req.body.newPassword != req.body.newPasswordConf)
		{
			res.json({success:false, passwordError:'Password strings do not match'});
			return;
		}
		let passwordError = validatePassword(req.body.newPassword);
		if(passwordError)
		{
			res.json({success:false, passwordError:passwordError});
			return;
		}
		try
		{
			let user = await User.findOne({resetKey:req.body.resetKey, resetNeeded:true});
			if(user)
			{
				let when = moment(user.resetRequested),
					now = moment(),
					days = when.diff(now, "days");
				if(days > 7)
				{
					res.json({success:false, expired:true});
					return;
				}
				
				let hash = await UserController.hashPassword(req.body.newPassword);
				
				user.resetKey = null;
				user.resetRequested = null;
				user.resetNeeded = false;
				user.passwordHash = hash.hash;
				user.passwordSalt = hash.salt;
				user.save();
				res.json({success:true});
				return;
			}
			
			res.json({success:false, found:false});
		}
		catch(e)
		{
			res.json({success:false, error:e});
			console.log(e);
		}
		return;
	}
	
	static async hashPassword(password)
	{
		let salt = await bcrypt.genSalt(10);
		let hash = await bcrypt.hash(password, salt);
		return {salt:salt, hash:hash};
	}
	
	static async processRegistrationFormAction(req, res, next)
	{
		let form = UserController.getFormFields(req.body);
		if(form.errors)
		{
			res.render('users/registrationForm', {form:form});
			return;
		}
		let userWithEmail = await Controller.getUserByEmail(req.body.email);
		if(userWithEmail)
		{
			form.inputs.email.error = 'Email address already in use';
			res.render('users/registrationForm', {form:form});
			return;
		}
		let hash = await UserController.hashPassword(req.body.password);
		
		req.body.passwordHash = hash.hash;
		req.body.passwordSalt = hash.salt;
		
		await User.create(req.body);
		res.render('users/userCreated', {form:form});
	}
	
	static async tryToLogin(req, res, next)
	{
		let user = await User.findOne({email:req.body.email});
		
		if(!user)
		{
			res.json({error:'Could not find a user with matching email and password', success:false});
			return;
		}
		
		let passwordMatch = await bcrypt.compare(req.body.password, user.passwordHash);
		if(!passwordMatch)
		{
			res.json({error:'Could not find a user with matching email and password', success:false});
			return;
		}
		
		req.session.user = {
			id: user._id,
			displayName: user.displayName,
			email:user.email
		};
		res.json({
			'success': 'true'
		});
		return;
	}
	
	static async logOut(req, res, next)
	{
		if (req.session)
		{
			req.session.destroy(
				function()
				{
					return res.redirect('/')
				}
			);
		}
	}
}

module.exports = UserController;