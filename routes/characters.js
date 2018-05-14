let express = require('express'),
	router = express.Router(),
	async = require('./asyncMiddleware'),
	controller = require('../controllers/CharacterController');

router.get('/', async(controller.indexAction));
router.post('/new', async(controller.newCharacterAction));
router.get('/fetch/:reference', async(controller.fetchAction));

module.exports = router;