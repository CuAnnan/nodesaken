'use strict';
let express = require('express'),
	router = express.Router(),
    async = require('./asyncMiddleware'),
    controller = require('../controllers/IndexController');

/* GET home page. */
router.get('/', async(controller.indexAction));

router.get('/botHelp', async(controller.botPageAction));

module.exports = router;
