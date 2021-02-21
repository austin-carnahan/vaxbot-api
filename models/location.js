//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var LocationSchema = new Schema({
  name: { type: String, required: true },
  parent_name: String,
  store_id: Number,
  address1: String,
  city: String,
  state: String,
  zip: Number,
  events: [Date],
  event_type: String,
  event_url: { type: String, required: true },
  updated: { type: Date, default: Date.now() },
  published: { type: Boolean, default: false }
  channels: [{ type: Schema.Types.ObjectId, ref: 'Channel' }]

});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('Location', LocationSchema );
