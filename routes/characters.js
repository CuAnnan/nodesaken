let express = require('express'),
	router = express.Router(),
	async = require('./asyncMiddleware'),
	controller = require('../controllers/CharacterController');

router.get('/', async(controller.indexAction));
router.get('/testUI', async(controller.testUI));

module.exports = router;