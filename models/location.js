//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
    name: { type: String, required: true },
    parent: String,
    store_id: Number,
    address1: { type: String, required: true },
    address2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: String,
    zip: { type: Number, required: true },
    events: [Date],
    tags: [String], //needs review
    location_url: String,
    signup_url: { type: String, required: true },
    phone: String,
    email: String,
    updated: { type: Date, default: Date.now() },
    published: { type: Boolean, default: false },
    channels: [{ type: Schema.Types.ObjectId, ref: 'Channel', required: true }],

});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('Location', LocationSchema, "Locations" );
