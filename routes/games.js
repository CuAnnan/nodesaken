'use strict';
let express = require('express'),
    router = express.Router(),
    async = require('./asyncMiddleware'),
    controller = require('../controllers/GameController');

router.get('/', async(controller.indexAction));

router.post('/new/', async(controller.newGameAction));

module.exports = router;