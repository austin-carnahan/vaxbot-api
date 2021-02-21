var Location = require('../models/location');

// return list of all Location GET
exports.location_list = async function(req, res) {
	try{
		const locations = await Location.find();
		res.json({"locations" : locations});
		
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// return details for a specific Location. GET
exports.location_detail = async function(req, res) {
	try {		
		const location = await Location.findById(req.params.id);
		
		if(!location) {
			res.status(404).json({ "message": `Unable to locate location with id: ${req.params.id}`});
			
		} else {
			res.json(location);
		}
		
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
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
    res.send('NOT IMPLEMENTED: Location search GET: ' + req.query.q);
};

// Batch update/upload locations.
exports.location_batch = function(req, res) {
    res.send('NOT IMPLEMENTED: Batch update locations POST');
};
