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

module.exports = router;
