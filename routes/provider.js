var express = require('express');
var router = express.Router();
const authenticate = require('../controllers/authController.js');
var provider_controller = require('../controllers/providerController');

// GET request for listing all providers.
router.get('/', provider_controller.provider_list);

// GET request for searching providers.
router.get('/search', provider_controller.provider_search);

// GET request for getting provider details.
router.get('/:id', provider_controller.provider_detail);

// Require authorization for non-read-only endpoints
router.use(authenticate)

// POST request for creating a provider.
router.post('/', provider_controller.provider_create);

// POST request for batch updating providers.
router.post('/batch', provider_controller.provider_batch);

// DELETE request for removing a provider.
router.delete('/:id', provider_controller.provider_delete);

// PATCH request for updating a provider.
router.patch('/:id', provider_controller.provider_update);

module.exports = router;
