var Location = require('../models/location');

// return list of all Location GET
exports.location_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Location list');
};

// return details for a specific Location. GET
exports.location_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Location detail: ' + req.params.id);
};

// Handle Location create on POST.
exports.location_create = function(req, res) {
    res.send('NOT IMPLEMENTED: Location create POST');
};

// Location delete.
exports.location_delete = function(req, res) {
    res.send('NOT IMPLEMENTED: Location delete DELETE' + req.params.id);
};

// Location update on PUT.
exports.location_update = function(req, res) {
    res.send('NOT IMPLEMENTED: Location update PUT' + req.params.id);
};

// Search for locations.
exports.location_search = function(req, res) {
    res.send('NOT IMPLEMENTED: Location search GET' + + req.params.query);
};

// Batch update/upload locations.
exports.location_batch = function(req, res) {
    res.send('NOT IMPLEMENTED: Batch update locations');
};
