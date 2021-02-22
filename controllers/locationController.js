var Location = require('../models/location');

// return list of all Location GET
exports.location_list = async function(req, res) {
	try{
		const locations = await Location.find();
		res.json(locations);
		
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// return details for a specific Location. GET
exports.location_detail = async function(req, res) {
	try {		
		const location = await Location.findById(req.params.id);
		
		if(!location) {
			res.status(404).json({ "message": `Unable to find location with id: ${req.params.id}`});
			
		} else {
			res.json(location);
		}
		
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Handle Location create on POST.
exports.location_create = async function(req, res) {
    try {		
		const location = await Location.findOne(req.body.name);
		if(location) {
			res.status(409).json({ "message": `Location already exists with name: ${req.body.name}`}); // is this the validation we want?
		} else {
            if(req.body.name && req.body.signup_url && req.body.channels) {
                location = new Location(
                    name = req.body.name,
                    parent = req.body.parent || null,
                    store_id = req.body.store_id || null,
                    address1 = req.body.address1 || null,
                    address2 = req.body.address2 || null,
                    city = req.body.city || null,
                    state = req.body.state || null,
                    country = req.body.country || null,
                    zip = Number(req.body.zip) || null,
                    events = req.body.events || [],
                    tags = req.body.tags || null,
                    location_url = req.body.location_url || null,
                    signup_url = req.body.signup_url || null,
                    phone = req.body.phone || null,
                    email = req.body.email || null,
                    channels = req.body.channels
                );
                
                const new_location = await location.save();	
                res.status(200).json(new_location);
            } else {
                res.status(400).json({ "message": "Missing parameters. Required: name, signup_url, channels"})
            }
		}
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Location delete.
exports.location_delete = async function(req, res) {
    try {		
        Location.deleteOne({_id = req.params.id});
        res.json({"message" : `Location deleted with id: ${req.params.id}`});			
    } catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);	
    }
};

// Location update on PUT.
exports.location_update = async function(req, res) {
    try {		
		const location = await Location.findById(req.params.id);
		if(!location) {
			res.status(404).json({ "message": `Unable to find location with id: ${req.params.id}`});
		} else {
			if (req.body.name && req.body.signup_url && req.body.channels ) {
				const updated_location = await location.set(req.body);
				res.json(updated_location);
			} else {
				res.status(400).json({ "message": "Missing parameters. Required: name, signup_url, channels"})
			}
		}
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Search for locations.
exports.location_search = async function(req, res) {
    try {
        let filter = {};
        for (param in req.query) {
            filter[param] = req.query[param];
        }
        
        const location = await Location.find(filter);
        
        if(!location) {
            res.status(404)json({ "message": `Unable to find location with parameters: ${query_obj}`})
        } else {
            res.json(location);
        }
        
    } catch (err) {
        res.status(500).send(`Oops! Something went wrong: \n ${err}`);
    }

};

// Batch update/upload locations.
exports.location_batch = async function(req, res) {
    try {
        
        let locations = [];
        
        for(item in req.body.locations) {
            
            let filter = {
                name: item.name,
                address1: item.address1,
                city: item.city,
                state: item.state,
                zip: Number(item.zip),
            };
            
            let update = {
                parent: req.body.parent || null,
                store_id: req.body.store_id || null,
                address2: req.body.address2 || null,
                events: req.body.events || [],
                tags: req.body.tags || null,
                location_url: req.body.location_url || null,
                signup_url: req.body.signup_url || null,
                phone: req.body.phone || null,
                email: req.body.email || null,
                updated: Date.now(),
                channels: req.body.channels,
            }
            
            let publish = false;            
            const old_location = await Location.findOne({filter});
            
            const new_location = await Location.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true,
            });
            
            if (new_location.events) {
                if (new_location.events.length > 0) {       // we've found some events
                    if(!old_location) {                     // this is a new record
                        // publish this                     
                    } else {                                // this is a record update
                        let difference = new_location.events.filter(x => !old_location.events.includes(x));
                        if(difference.length > 0) {         // there are events in this update that are new
                            // publish this
                        }
                    }
                }
            }
            
            locations.push(new_location);

        }
        
        res.json(locations);
        
    } catch(err) {
        res.status(500).send(`Oops! Something went wrong: \n ${err}`);
    }
    res.send('NOT IMPLEMENTED: Batch update locations POST');
};
