var express = require('express');
var router = express.Router();
const authenticate = require('../controllers/authController.js');
var channel_controller = require('../controllers/channelController');

// GET request for listing all channels.
router.get('/', channel_controller.channel_list);

// GET request for running channel mappings
router.get('/populate', channel_controller.channel_populate)

// GET request for getting a channels details.
router.get('/:id', channel_controller.channel_detail);

// Require authorization for non-read-only endpoints
router.use(authenticate)

// POST request for creating a channel.
router.post('/', channel_controller.channel_create);

// DELETE request for removing a channel.
router.delete('/:id', channel_controller.channel_delete);

// PATCH request for updating a channel.
router.patch('/:id', channel_controller.channel_update);

module.exports = router;
