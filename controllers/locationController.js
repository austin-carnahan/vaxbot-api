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
	    let location = await Location.findOne({name: req.body.name});
	    if(location) {
		    res.status(409).json({ "message": `Location already exists with name: ${req.body.name}`}); // is this the validation we want?
	    }
            if(req.body.name && req.body.signup_url && req.body.channels) {
                location = new Location(req.body)
                    //~ name : req.body.name,
                    //~ parent : req.body.parent || null,
                    //~ store_id : req.body.store_id || null,
                    //~ address1 : req.body.address1,
                    //~ address2 : req.body.address2 || null,
                    //~ city : req.body.city,
                    //~ state : req.body.state,
                    //~ country : req.body.country || null,
                    //~ zip : Number(req.body.zip),
                    //~ events : req.body.events || [],
                    //~ tags : req.body.tags || null,
                    //~ location_url : req.body.location_url || null,
                    //~ signup_url : req.body.signup_url || null,
                    //~ phone : req.body.phone || null,
                    //~ email : req.body.email || null,
                    //~ channels : req.body.channels
                //~ });
                
                const new_location = await location.save();	
                res.status(200).json(new_location);
            } else {
                res.status(400).json({ "message": "Missing parameters. Required: name, city, state, zip, signup_url, channels"})
            }

	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Location delete.
exports.location_delete = async function(req, res) {
    try {		
        await Location.deleteOne({_id : req.params.id});
        res.json({"message" : `Location deleted with id: ${req.params.id}`});			
    } catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);	
    }
};

// Location update on PATCH
exports.location_update = async function(req, res) {
    try {		
		const location = await Location.findById(req.params.id);
		if(!location) {
			res.status(404).json({ "message": `Unable to find location with id: ${req.params.id}`});
		} else {
			if (req.body.name && req.body.signup_url && req.body.channels ) {
				const updated_location = await location.set(req.body);
				await updated_location.save();
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
            res.status(404).json({ "message": `Unable to find location with parameters: ${query_obj}`})
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
	
	let response_data = []
		
	for(let i=0; i < req.body.length; i++) {
	    let location = await Location.findOne({name: req.body[i].name});
	    
	    if(location){ //we patch the existing document
		const updated_location = await location.set(req.body[i]);
		await updated_location.save();
		response_data.push(updated_location);
	    } else { //we create a new documenet
		location = new Location(req.body[i]);
		const new_location = await location.save();
		response_data.push(new_location);
	    }
	}
        
        res.status(200).json(response_data);
        
    } catch(err) {
        res.status(500).send(`Oops! Something went wrong: \n ${err}`);
    }
};
