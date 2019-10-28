'use strict';
let express = require('express'),
    router = express.Router(),
    async = require('./asyncMiddleware'),
    controller = require('../controllers/PackController');

router.get('/', async(controller.indexAction));

module.exports = router;