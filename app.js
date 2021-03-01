require('dotenv').config()
const create_server = require("./server")

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

const app = create_server();

module.exports = app;
