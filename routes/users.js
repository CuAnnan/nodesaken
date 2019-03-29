'use strict';
let express = require('express'),
	router = express.Router(),
	async = require('./asyncMiddleware'),
	controller = require('../controllers/UserController');

router.get('/', async(controller.indexAction));

router.get('/register', async(controller.registrationFormAction));
router.post('/register', async(controller.processRegistrationFormAction));

router.post('/tryToLogin', async(controller.tryToLogin));

router.get('/logout', async(controller.logOut));

router.get('/account', async(controller.accountAction));

router.post('/account', async(controller.updateAccountAction));

router.post('/lostPassword', async(controller.generateLostPasswordEmail));
router.get('/lostPassword/:resetKey', async(controller.displayLostPasswordForm));
router.post('/passwordReset', async(controller.updatePasswordAction));

module.exports = router;
