//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  posts: { type: Number, default: 0},
});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('Channel', ChannelSchema );
