'use strict';
let express = require('express'),
	router = express.Router(),
	async = require('./asyncMiddleware'),
	controller = require('../controllers/CharacterController');

router.get('/', async(controller.indexAction));
router.post('/new', async(controller.newCharacterAction));
router.get('/fetch/:reference', async(controller.fetchAction));
router.post('/save', async(controller.saveCharacterAction));
router.post('/generateAPIKey', async(controller.generateAPIKey));
router.get('/getAPIKeys/:reference', async(controller.getAPIKeys));

module.exports = router;