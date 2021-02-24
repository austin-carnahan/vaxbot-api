var express = require('express');
var router = express.Router();

// Require controller modules.
var location_controller = require('../controllers/locationController');

// GET request for listing all locations.
router.get('/', location_controller.location_list);

// POST request for creating a location.
router.post('/', location_controller.location_create);

// GET request for searching locations.
router.get('/search/', location_controller.location_search);

// POST request for batch updating locations.
router.post('/batch', location_controller.location_batch);

// GET request for getting location details.
router.get('/:id', location_controller.location_detail);

// DELETE request for removing a location.
router.delete('/:id', location_controller.location_delete);

// PATCH request for updating a location.
router.patch('/:id', location_controller.location_update);

module.exports = router;
