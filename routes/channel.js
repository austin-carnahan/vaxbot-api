var express = require('express');
var router = express.Router();

// Require controller modules.
var channel_controller = require('../controllers/channelController');

// GET request for listing all channels.
router.get('/', channel_controller.channel_list);

// POST request for creating a channel.
router.post('/', channel_controller.channel_create);

// GET request for getting a channels details.
router.get('/:id', channel_controller.channel_detail);

// DELETE request for removing a channel.
router.delete('/:id', channel_controller.channel_delete);

// PUT request for updating a channel.
router.put('/:id', channel_controller.channel_update);

// POST request for subscribing to channel.
router.post('/:id/subscribe', channel_controller.channel_subscribe);

module.exports = router;
