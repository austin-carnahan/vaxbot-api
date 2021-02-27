//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
    name: { type: String, required: true },
    cdc_id: String,
    standardized_address: String,
    source_updated: Date,
    source_url: { type: String, required: true },
    source_name: { type: String, required: true },
    address1: { type: String, required: true },
    address2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: String,
    zip: { type: Number, required: true },
    lat: Number,
    lon: Number,
    tags: [String],
    contact_url: { type: String },
    //~ updated: { type: Date, default: Date.now() },
    vaccine_available: { type: Boolean, default: false },
    vaccine_tags: [String],
    published: { type: Boolean, default: false },
    channels: [{ type: Schema.Types.ObjectId, ref: 'Channel', required: true }],

}, { timestamps: true });

//Export function to create "SomeModel" model class
module.exports = mongoose.model('Location', LocationSchema, "Locations" );
