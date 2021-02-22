var Channel = require('../models/channel');

// return list of all Channels GET
exports.channel_list = async function(req, res) {
	try{
		const channels = await Channel.find();
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
exports.channel_create = async function(req, res) {
    try {		
		const channel = await Channel.findOne(req.body.name);
		if(channel) {
			res.status(409).json({ "message": `Channel already exists with name: ${req.body.name}`});
		} else {
			channel = new Channel(
				name = req.body.name, 
				description = req.body.description,
				state = req.body.state,
				country = req.body.country || null,
				);
			
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
		Channel.deleteOne({_id = req.params.id});
		res.json({"message" : `Channel deleted with id: ${req.params.id}`});			
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);	
	}
};

// Channel update on PUT.
exports.channel_update = function(req, res) {
    try {		
		const channel = await Channel.findById(req.params.id);
		if(!channel) {
			res.status(404).json({ "message": `Unable to locate channel with id: ${req.params.id}`});
		} else {
			if (req.body.name && req.body.description && req.body.state ) {
				const updated_channel = await channel.set(req.body);
				res.json(updated_channel);
			} else {
				res.status(400).json({ "message": "Missing parameters. Required: name, description, state"})
			}
		}
	} catch(err) {
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Subscribe to specific Channel on GET.
exports.channel_subscribe = function(req, res) {
    res.send('NOT IMPLEMENTED: Channel subscribe POST' + + req.params.id);
};
