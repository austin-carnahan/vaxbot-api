require('dotenv').config()
const mongoose = require("mongoose")
const create_server = require("../server")
var Channel = require('../models/channel');
const supertest = require('supertest');

beforeAll( async () => {
    console.log("opening db connection...");
    await mongoose.connect(process.env.MONGODB_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll( async() => {
    console.log("closing db connection...");
    await mongoose.connection.close();
});

const app = create_server()

describe("v1/channels endpoints integration tests", () => {
    
    let channel;
    
    beforeEach( async () => {
        console.log("creating new instance of Channel...");
        channel = await Channel.create({
            name: "STL",
            description: "St. Louis, MO, USA",
        })
    });
    
    afterEach( async() => {
        console.log("deleting channel");
        channel = await channel.deleteOne();
    });

    test("GET v1/channels", async () => {


        await supertest(app)
            .get("/v1/channels")
            .expect(200)
            .then((response) => {
                // Check the response type and length
                expect(Array.isArray(response.body)).toBeTruthy()
                expect(response.body.length).toEqual(1)

                // Check the response data
                expect(response.body[0]._id).toBe(channel.id)
                expect(response.body[0].name).toBe(channel.name)
                expect(response.body[0].description).toBe(channel.description)
            })
    })
  
    test("GET v1/channels/:id", async () => {

        await supertest(app)
            .get("/v1/channels/" + channel.id)
            .expect(200)
            .then((response) => {
                // Check the response data
                expect(response.body._id).toBe(channel.id)
                expect(response.body.name).toBe(channel.name)
                expect(response.body.description).toBe(channel.description)
            })
    })
})
