var Provider = require('../models/provider');
const fetch = require('node-fetch');

async function publish_or_nah(req, updated_record, existing_record_availability = null) {
    if (!existing_record_availability && updated_record.vaccine_available) {
        //publish
        let string_channel = String(updated_record.channel.name);
        let string_record = JSON.stringify(updated_record);
        req.app.get('publisher').publish(string_channel, string_record)
        console.log("Record published");
    //~ } else if(updated_record.vaccine_available) {
        //~ //publish
        //~ await updated_record.populate('channel').execPopulate();
        //~ const channel = updated_record.channel;
        //~ console.log(channel.name);
        //~ req.app.get('publisher').publish("STL", channel.description)
        //~ console.log("Record published");
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
        for (param in req.query) {
            filter[param] = req.query[param];
        }
        
        const provider = await Provider.find(filter);
        
        if(!provider) {
            res.status(404).json({ "message": `Unable to find provider with parameters: ${query_obj}`})
        } else {
            res.json(provider);
        }
        
    } catch (err) {
        res.status(500).send(`Oops! Something went wrong: \n ${err}`);
    }

};

// Batch update/upload providers.
exports.provider_batch = async function(req, res) {
    try {
	
        let response_data = []
            
        for(let item of req.body) {
            let formatted_addr = await standardize_address(`${item.address1},${item.address2 ? item.address2 + "," : ""}${item.city},${item.state}${item.zip ? "," + item.zip : ""}`)
            
            if (!formatted_addr && !item.source_name == "MO Department of Health") {
                console.log(`FAILURE. Unable to upload provider ${item.name}. Address Standardization Failure. Skipping...`);
                continue
            }
            
            console.log("searching for existing provider...");
            let provider = null;
            if(!item.source_name == "MO Department of Health")      // Janky Janky Janky....
                provider = await Provider.findOne({
                standardized_address: formatted_addr,
                });
            else {
                provider = await Provider.findOne({
                address1: item.address1,
                });
            }
            
            if(provider){ //we patch the existing document
                console.log(`we found: ${provider.name} @${provider.standardized_address}`);
                const existing_record_availability = provider.vaccine_available;
                const updated_provider = await provider.set(item);
                await updated_provider.save();
                await updated_provider.populate('channel').execPopulate();
                response_data.push(updated_provider);
                publish_or_nah(req, updated_provider, existing_record_availability);
                
            } else { //we create a new documenet
                console.log("No record found. Creating new Provider...");
                provider = new Provider(item);
                provider.standardized_address = formatted_addr;
                const new_provider = await provider.save();
                await new_provider.populate('channel').execPopulate();
                response_data.push(new_provider);
                publish_or_nah(req, new_provider);
            }
        }
        
        res.status(200).json(response_data);
        
    } catch(err) {
        console.log(`ERROR: ${err}`);
        res.status(500).send(`Oops! Something went wrong: \n ${err}`);
    }
};
