var Channel = require('../models/channel');

// return list of all Channels GET
exports.channel_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Channel list');
};

// return details for a specific Channel. GET
exports.channel_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Channel detail: ' + req.params.id);
};

// Handle Channel create on POST.
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
    res.send('NOT IMPLEMENTED: Channel subscribe GET' + + req.params.id);
};
