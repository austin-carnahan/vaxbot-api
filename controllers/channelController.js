var Channel = require('../models/channel');
var Provider = require('../models/provider');

// return list of all Channels GET
exports.channel_list = async function(req, res) {
	try{
		const channels = await Channel.find();
		if(!channels) {
			res.status(400).json({ "message": `Unable to locate any channels`});
		}
		res.json(channels);
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// return details for a specific Channel GET
exports.channel_detail = async function(req, res) {
	try {		
		const channel = await Channel.findById(req.params.id);
		if(!channel) {
			res.status(404).json({ "message": `Unable to locate channel with id: ${req.params.id}`});
		} else {
			res.json(channel);
		}
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Channel create on POST.
exports.channel_create = async function(req, res) {			//need to work on default values
    try {		
		let channel = await Channel.findOne({ name : req.body.name });
		if(channel) {
			res.status(409).json({ "message": `Channel already exists with name: ${req.body.name}`});
		} else {
			channel = new Channel({
				name : req.body.name, 
				description : req.body.description,
				state: req.body.state,
				location: req.body.location,
				radius: req.body.radius,
			});
			
			const new_channel = await channel.save();	
			res.status(200).json(new_channel);
		}
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Channel delete
exports.channel_delete = async function(req, res) {
	try {		
		await Channel.deleteOne({_id : req.params.id});
		res.json({"message" : `Channel deleted with id: ${req.params.id}`});			
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);	
	}
};

// Channel update on PUT.
exports.channel_update = async function(req, res) {
    try {		
		const channel = await Channel.findById(req.params.id);
		if(!channel) {
			res.status(404).json({ "message": `Unable to locate channel with id: ${req.params.id}`});
		} else {
			if (req.body.name && req.body.description) {
				const updated_channel = await channel.set(req.body);
				await updated_channel.save();
				res.json(updated_channel);
			} else {
				//~ res.status(400).json(req);
				res.status(400).json({ "message": `Missing parameters. Required: name, description \n Provided: ${req.body}`})
			}
		}
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Populate channels by adding them to providers
exports.channel_populate = async function(req, res) {
	try {
		console.log("populating channels...");
		let channels = await Channel.find();
		
		for(channel of channels) {
			let distance_meters = channel.radius * 1609.34;
			Provider.find({
				location: {
					$near: {
						$maxDistance: distance_meters,
						$geometry: {
							type: 'Point',
							coordinates: channel.location.coordinates,
						},
					},
				},
			}).find((error, results) => {
					if (error) throw(error);
					//~ console.log(JSON.stringify(results, 0, 2));
					channel.set({providers: results.length || 0});
					channel.save();
					console.log(`found ${results.length} providers`);
					for(provider of results) {
						provider.set({channel: channel._id});
						provider.save();
					}
					
					res.status(200).send("Successfully populated channels");
				});
		}
		
	} catch (err) {
		console.log(err);
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};
