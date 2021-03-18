//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  state: {type: String, required: true },
  location: { 
        type: {type: String},
        coordinates: [Number],
    },
  radius: { type: Number, required: true, default: 30 }, //distance in miles
  posts: { type: Number, default: 0},
  providers: { type: Number, default: 0},
});

ChannelSchema.index({ location: "2dsphere" });
//Export function to create "SomeModel" model class
module.exports = mongoose.model('Channel', ChannelSchema, 'Channels');
