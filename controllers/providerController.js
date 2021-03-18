var Provider = require('../models/provider');
const fetch = require('node-fetch');

async function publish_or_nah(req, updated_record, existing_record_availability = null) {
    if (!existing_record_availability && updated_record.vaccine_available) {
        //publish
        let string_channel = String(updated_record.channel.name);
        let string_record = JSON.stringify(updated_record);
        req.app.get('publisher').publish(string_channel, string_record)
        console.log("Record published");
    } else {
        console.log("Record not published");
    }
    
}

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


// return list of all Provider GET
exports.provider_list = async function(req, res) {
	try{
		const providers = await Provider.find();
		res.json(providers);
		
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// return details for a specific Provider. GET
exports.provider_detail = async function(req, res) {
	try {		
		const provider = await Provider.findById(req.params.id);
		
		if(!provider) {
			res.status(404).json({ "message": `Unable to find provider with id: ${req.params.id}`});
			
		} else {
			res.json(provider);
		}
		
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Handle Provider create on POST.
exports.provider_create = async function(req, res) {
    try {
        
        let formatted_addr = await standardize_address(`${req.body.address1},${req.body.address2 ? req.body.address2 : ""},${req.body.city},${req.body.state},${req.body.zip}`);
        		
	    let provider = await Provider.findOne({name: req.body.name});
	    if(provider) {
		    res.status(409).json({ "message": `Provider already exists with name: ${req.body.name}`}); // is this the validation we want?
	    }
            if(req.body.name && req.body.channel) {
                provider = new Provider(req.body);
                provider.standardized_address = formatted_addr;
                const new_provider = await provider.save();	
                res.status(200).json(new_provider);
            } else {
                res.status(400).json({ "message": "Missing parameters. Required: name, city, state, zip, signup_url, channel"})
            }

	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Provider delete.
exports.provider_delete = async function(req, res) {
    try {		
        await Provider.deleteOne({_id : req.params.id});
        res.json({"message" : `Provider deleted with id: ${req.params.id}`});			
    } catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);	
    }
};

// Provider update on PATCH
exports.provider_update = async function(req, res) {
    try {		
		const provider = await Provider.findById(req.params.id);
		if(!provider) {
			res.status(404).json({ "message": `Unable to find provider with id: ${req.params.id}`});
		} else {
			if (req.body.name && req.body.channel ) {
				const updated_provider = await provider.set(req.body);
				await updated_provider.save();
				res.json(updated_provider);
			} else {
				res.status(400).json({ "message": "Missing parameters. Required: name, signup_url, channel"})
			}
		}
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Search for providers.
exports.provider_search = async function(req, res) {
    try {
 
        let filter = {};
        if(req.query) {
            for (param in req.query) {
                if(param == "lat" || param == "lon" || param == "radius") {
                    continue;
                }
                if(param == "vaccine_available") {
                    filter[param] = Boolean(req.query[param]);
                    continue;
                }
                filter[param] = req.query[param];
            }
            
            // Geographic query
            if(req.query.lon && req.query.lat) {
                let max_distance_meters = 1000 * 1609.34;		//FIX ME ONE DAY!
                if(req.query.radius) {
                    max_distance_meters = Number(req.query.radius) * 1609.34;
                }

                Provider.aggregate([
                    {
                        $geoNear : {
                            near : {
                                type: "Point",
                                coordinates: [Number(req.query.lon), Number(req.query.lat)],
                            },
                            distanceField: "dist.calculated",
                            maxDistance: max_distance_meters,
                            distanceMultiplier: 1/1609.344,
                            spherical: true,
                            query: filter
                        }
                    }
                ], (err, results) => {
                        if(err) {
                            console.log(`ERROR: ${err}`);
                            throw new Error(err);
                        } else {
                            res.json(results);
                        }
                    })
            } else {
                // regular filter query
                const providers = await Provider.find(filter);
            
                if(!providers) {
                    res.status(404).json({ "message": `Unable to find providers with parameters: ${query_obj}`})
                } else {
                    res.json(providers);
                }
            }
        } else {
            // empty filter, return all providers
            const providers = await Provider.find(filter);
            
            if(!providers) {
                res.status(404).json({ "message": `Unable to find providers with parameters: ${query_obj}`})
            } else {
                res.json(providers);
            }
        }
    } catch (err) {
        console.log(`ERROR: ${err}`);
        res.status(500).send(`Oops! Something went wrong: \n ${err}`);
    }

};

// Batch update/upload providers.
exports.provider_batch = async function(req, res) {
    try {
	
        let response_data = []
            
        for(let item of req.body) {
            console.log("searching for existing provider...");
            let provider = null;
            
            if(item.source_id) {
                provider = await Provider.findOne({
                source_id: item.source_id,
                });
            } else {
                provider = await Provider.findOne({
                address1: item.address1,
                city: item.city,
                state: item.state,
                });
            }
            
            if(provider){ //we patch the existing document
                console.log(`we found: ${provider.name} @${provider.address1}`);
                const existing_record_availability = provider.vaccine_available;
                const updated_provider = await provider.set(item);
                await updated_provider.save();
                response_data.push(updated_provider);
		if(updated_provider.channel) {
			await updated_provider.populate('channel').execPopulate();
			publish_or_nah(req, updated_provider, existing_record_availability);
		}
		
            } else { //we create a new documenet
                console.log("No record found. Creating new Provider...");
                provider = new Provider(item);
                const new_provider = await provider.save();
                response_data.push(new_provider);
		if(new_provider.channel) {
			await new_provider.populate('channel').execPopulate();
			publish_or_nah(req, new_provider);
		}
            }
        }
        
        res.status(200).json(response_data);
        
    } catch(err) {
        console.log(`ERROR: ${err}`);
        res.status(500).send(`Oops! Something went wrong: \n ${err}`);
    }
};

exports.providers_meta = async function providers_meta(req, res) {
    try {
        let provider = await Provider.findOne().sort({"updatedAt": -1 });
        let last_scan = provider.updatedAt;
        let count = await Provider.estimatedDocumentCount();
        let count_available = await Provider.countDocuments({vaccine_available: true});
        
        res.status(200).json({"last_scan": last_scan, "providers_scanned": count, "providers_with_vaccine": count_available});
        
    } catch(err) {
        console.log(`ERROR: ${err}`);
        res.status(500).send(`Oops! Something went wrong: \n ${err}`);
    }
};
