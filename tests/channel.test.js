require('dotenv').config()
const mongoose = require("mongoose")
const create_server = require("../server")
var Channel = require('../models/channel');
const supertest = require('supertest');

beforeEach(async () => {
	await mongoose.connect(process.env.MONGODB_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterEach(async () => {
	await mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close()
	})
})

const app = create_server()

describe("v1/channels endpoints integration tests", () => {

    test("GET v1/channels", async () => {
        const channel = await Channel.create({
            name: "STL",
            description: "St. Louis, MO, USA",
        })

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
        const channel = await Channel.create({
        name: "STL",
        description: "St. Louis, MO, USA",
    })

    await supertest(app)
        .get("/v1/channels/" + channel.id)
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
})
