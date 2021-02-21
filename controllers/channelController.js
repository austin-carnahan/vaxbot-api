var Channel = require('../models/channel');

// return list of all Channels GET
exports.channel_list = async function(req, res) {
	try{
		const channels = await Channel.find();
		res.json({"channels" : channels});
		
	} catch(err) {
		//err.message = "No channels found";
		res.status(500).send("Oops! Something went wrong...");
	}
};

// return details for a specific Channel. GET
exports.channel_detail = async function(req, res) {
	try {		
		const channel = await Channel.findById(req.params.id);
		
		if(!channel) {
			res.status(404).json({ "message": `Unable to locate channel with id: ${req.params.id}`});
			
		} else {
			res.json(channel);
		}
		
	} catch(err) {
		//err.message = "No channels found";
		res.status(500).send(`Oops! Something went wrong: \n ${err}`);
	}
};

// Channel create on POST.
exports.channel_create = function(req, res) {
    res.send('NOT IMPLEMENTED: Channel create POST');
};

// Channel delete.
exports.channel_delete = function(req, res) {
    res.send('NOT IMPLEMENTED: Channel delete DELETE' + req.params.id);
};

// Channel update on PUT.
exports.channel_update = function(req, res) {
    res.send('NOT IMPLEMENTED: Channel update PUT' + req.params.id);
};

// Subscribe to specific Channel on GET.
exports.channel_subscribe = function(req, res) {
    res.send('NOT IMPLEMENTED: Channel subscribe POST' + + req.params.id);
};
