//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ProviderSchema = new Schema({
    name: { type: String, required: true },
    source_updated: Date,
    source_url: { type: String, required: true },
    source_name: { type: String, required: true },
    source_id: String,
    standardized_address: String,
    address1: { type: String, required: true },
    address2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: String,
    zip: { type: Number},
    lat: Number,
    lon: Number,
    tags: [String],
    dates: [Date],
    contact_url: { type: String },
    vaccine_available: { type: Boolean, default: false },
    vaccine_tags: [String],
    published: { type: Boolean, default: false },
    channel: { type: Schema.Types.ObjectId, ref: 'Channel', required: true },

}, { timestamps: true });

//Export function to create "SomeModel" model class
module.exports = mongoose.model('Provider', ProviderSchema, "Providers" );
