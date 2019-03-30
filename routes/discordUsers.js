'use strict';
let express = require('express'),
    router = express.Router(),
    async = require('./asyncMiddleware'),
    controller = require('../controllers/DiscordUserController');

router.patch('/approve/:reference', async(controller.approveDiscordUserRequest));
router.patch('/reject/:reference', async(controller.rejectDiscordUserRequest));


module.exports = router;
