var Location = require('../models/location');
const fetch = require('node-fetch');

async function standardize_address(string) {
    try{
        console.log("Pinging US Census Bureau...")
        const standardized_address = await fetch(encodeURI(
            `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${string}&benchmark=2020&format=json`))
                .then(async (response) => await response.json())
                .then(json => json.result.addressMatches[0] ? json.result.addressMatches[0].matchedAddress : null)
        if(standardized_address) {
            console.log(`SUCCESS. Retrieved strandardized address: ${standardized_address}`)
            return standardized_address
        }
        console.log(`FAILURE: Could not find standardized address: ${string}`)
        return null
    } catch(err) {
        console.log(`ERROR: Something went wrong \n ${err}`);
        return null
    }
	
}


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
        
        let formatted_addr = await standardize_address(`${req.body.address1},${req.body.address2 ? req.body.address2 : ""},${req.body.city},${req.body.state},${req.body.zip}`);
        		
	    let location = await Location.findOne({name: req.body.name});
	    if(location) {
		    res.status(409).json({ "message": `Location already exists with name: ${req.body.name}`}); // is this the validation we want?
	    }
            if(req.body.name && req.body.channels) {
                location = new Location(req.body);
                location.standardized_address = formatted_addr;
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
			if (req.body.name && req.body.channels ) {
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
            
        for(let item of req.body) {
            let formatted_addr = await standardize_address(`${item.address1},${item.address2 ? item.address2 + "," : ""}${item.city},${item.state}${item.zip ? "," + item.zip : ""}`)
            
            if (!formatted_addr) {
                console.log(`FAILURE. Unable to upload location ${item.name}. Address Standardization Failure. Skipping...`);
                continue
            }
            
            console.log("searching for existing location...");
            let location = await Location.findOne({
                standardized_address: formatted_addr,
            });
            
            console.log(`we found: ${location}`);
            
            if(location){ //we patch the existing document
                console.log("entered block 1");
                const updated_location = await location.set(item);
                await updated_location.save();
                response_data.push(updated_location);
            } else { //we create a new documenet
                console.log("entered block 2");
                location = new Location(item);
                location.standardized_address = formatted_addr;
                const new_location = await location.save();
                response_data.push(new_location);
            }
        }
        
        res.status(200).json(response_data);
        
    } catch(err) {
        console.log(`ERROR: ${err}`);
        res.status(500).send(`Oops! Something went wrong: \n ${err}`);
    }
};
