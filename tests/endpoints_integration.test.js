require('dotenv').config()
const mongoose = require("mongoose")
const create_server = require("../server")
var Channel = require('../models/channel');
var Location = require('../models/location');
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
        await Channel.deleteMany();
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
    
    test("DELETE v1/channels/:id", async () => {

        await supertest(app)
            .delete("/v1/channels/" + channel.id)
            .expect(200)
            .then(async (response) => {
                // Check the response data
                console.log(response.body.message)
                expect(await Channel.findOne({ _id: channel.id })).toBeFalsy()
            })
    })
    
    test("PATCH v1/channels/:id", async () => {
        
        const data = { 
                name: "KCMO",
                description: "Kansas city, MO" 
            }
        
        await supertest(app)
            .patch("/v1/channels/" + channel.id)
            .send(data)
            .expect(200)
            .then(async (response) => {
                console.log(response.text);
                // Check the response data
                // Check the data in the database
                const updated_channel = await Channel.findOne({ _id: channel.id })
                expect(updated_channel).toBeTruthy()
                expect(updated_channel.name).toBe(data.name)
                expect(updated_channel.description).toBe(data.description)
            })
    })
    
        test("POST v1/channels", async () => {
        
        const data = { 
                name: "KCMO",
                description: "Kansas city, MO" 
            }
        
        await supertest(app)
            .post("/v1/channels")
            .send(data)
            //~ .expect(200)
            .then(async (response) => {
                console.log(response.text);
                // Check the response data
                // Check the data in the database
                const new_channel = await Channel.findOne({ name: data.name })
                expect(new_channel).toBeTruthy()
                expect(new_channel.name).toBe(data.name)
                expect(new_channel.description).toBe(data.description)
            })
    })
})

describe("v1/locations endpoints integration tests", () => {
    
    let location;
    let loc_channel;
    let date1;
    let date2;
    
    beforeAll( async () => {
        date1 = new Date('December 19, 2021 09:06:00Z');
        date2 = new Date('December 17, 2021 016:55:00Z');
    });
    
    beforeEach( async () => {
        console.log("creating new instance of Location...");
        
        loc_channel = await Channel.create({
            name: "COL",
            description: "Columbia, MO, USA",
        })
        
        location = await Location.create({
            name: "Shrewsbury Superstore",
            parent: "Walmart",
            store_id: 1234,
            address1: "1234 Walmart st",
            city: "St. Louis",
            state: "MO",
            country: "USA",
            zip: 63104,
            events: [date1, date2],
            tags: ["apointment"], //needs review
            signup_url: "www.walmart.com/pharmacy/covid",
            channels: [loc_channel.id],
        })
    });
    
    afterEach( async() => {
        console.log("deleting location");
        await Location.deleteMany();
        await Channel.deleteMany();
    });
    
    test("GET v1/locations", async () => {

        await supertest(app)
            .get("/v1/locations")
            .expect(200)
            .then((response) => {
                // Check the response type and length
                expect(Array.isArray(response.body)).toBeTruthy()
                expect(response.body.length).toEqual(1)

                // Check the response data
                expect(response.body[0]._id).toBe(location.id)
                expect(response.body[0].name).toBe(location.name)
                expect(response.body[0].events.length).toBe(location.events.length)
                expect(response.body[0].channels.length).toBe(location.channels.length)
            })
    })
    
    test("GET v1/locations/:id", async () => {

        await supertest(app)
            .get("/v1/locations/" + location.id)
            .expect(200)
            .then((response) => {
                // Check the response data
                expect(response.body._id).toBe(location.id)
                expect(response.body.name).toBe(location.name)
                expect(response.body.address1).toBe(location.address1)
            })
    })
    
    test("DELETE v1/locations/:id", async () => {

        await supertest(app)
            .delete("/v1/locations/" + location.id)
            .expect(200)
            .then(async (response) => {
                // Check the response data
                console.log(response.body.message)
                expect(await Location.findOne({ _id: location.id })).toBeFalsy()
            })
    })
    
    test("PUT v1/locations/:id", async () => {
        
        const date3 = new Date('August 19, 2022 16:09:00Z');
        
        const data = { 
                name: "Maplewood Pharmacy",
                parent: "Walgreens",
                address1: "1234 Walmart st",
                city: "St. Louis",
                state: "MO",
                zip: 63104,
                events: [date3],
                tags: ["apointment", "first-come"], //needs review
                signup_url: "www.walmart.com/pharmacy/covid",
                channels: [loc_channel.id],
            }
        
        await supertest(app)
            .patch("/v1/locations/" + location.id)
            .send(data)
            .expect(200)
            .then(async (response) => {
                const updated_loc = await Location.findOne({ _id: location.id })
                expect(updated_loc).toBeTruthy()
                expect(updated_loc.name).toBe(data.name)
                expect(updated_loc.store_id).toBe(location.store_id)
                expect(updated_loc.parent).toBe(data.parent)
                expect(updated_loc.events.length).toBe(1)
            })
    })
    
    test("POST v1/locations", async () => {
        const date3 = new Date('August 19, 2022 16:09:00Z');
        
        const data = { 
                name: "South City Pharmacy",
                parent: "CVS",
                address1: "1245 Henrietta st",
                city: "St. Louis",
                state: "MO",
                zip: 63104,
                events: [date3],
                tags: ["apointment", "first-come"], //needs review
                signup_url: "www.walmart.com/pharmacy/covid",
                channels: [loc_channel.id],
            }
        
        await supertest(app)
            .post("/v1/locations")
            .send(data)
            .expect(200)
            .then(async (response) => {
                const new_loc = await Location.findOne({ name: data.name })
                expect(new_loc).toBeTruthy()
                expect(new_loc.name).toBe(data.name)
                expect(new_loc.address1).toBe(data.address1)
                expect(new_loc.events.length).toBe(1)
            })
    })
    
    test("POST v1/locations/batch", async () => {
        
        let date3 = new Date('April 12, 2021 7:45:00Z');    //new dates
        let date4 = new Date('June 6, 2021 12:32:00Z');
        
        let location_no_events = await Location.create({
            name: "Chuck E Cheeze",      //new loc w empty events
            parent: "Mickey",
            store_id: 515483241584,
            address1: "2225 Sesame Street",
            city: "St. Louis",
            state: "MO",
            country: "USA",
            zip: 63115,
            events: [],
            tags: ["appointment"],
            signup_url: "www.CEC.com/pharmacy/covid",
            channels: ["603728f58974f823c9e2a0d1"],
        })
        
        const data = [
            {
                name: "Shrewsbury Superstore",      //existing
                parent: "Walmart",
                store_id: 1234,
                address1: "1234 Walmart st",
                city: "St. Louis",
                state: "MO",
                country: "USA",
                zip: 63104,
                events: [date3],
                tags: ["apointment"],
                signup_url: "www.walmart.com/pharmacy/covid",
                channels: ["603728f58974f823c9e2a0d1"],
            },
            {
                name: "CVS Downtown",                   //new
                parent: "CVS",
                store_id: 2,
                address1: "1234 Main st",
                city: "St. Louis",
                state: "MO",
                country: "USA",
                zip: 63104,
                events: [],
                tags: ["apointment"],
                signup_url: "www.CVS.com/pharmacy/covid",
                channels: ["603728f58974f823c9e2a0d1"],
            },
            {
                name: "Chuck E Cheeze",             //existing
                parent: "Mickey",
                store_id: 515483241584,
                address1: "2225 Sesame Street",
                city: "St. Louis",
                state: "MO",
                country: "USA",
                zip: 63115,
                events: [date1, date2, date3, date4],
                tags: ["appointment"],
                signup_url: "www.CEC.com/pharmacy/covid",
                channels: ["603728f58974f823c9e2a0d1"],
            }
        ]
        
        
        await supertest(app)
            .post("/v1/locations/batch")
            .send(data)
            .expect(200)
            .then(async (response) => {
                // Check response
                expect(Array.isArray(response.body)).toBeTruthy()
                expect(response.body.length).toEqual(3)

                // Check if we updated the existing event
                const new_loc_0 = await Location.findOne({ name: data[0].name })
                expect(new_loc_0.events.length).toBe(data[0].events.length)
                
                // Check if we created new events
                const new_loc_1 = await Location.findOne({ name: data[1].name })
                expect(new_loc_1).toBeTruthy()
                expect(new_loc_1.name).toBe(data[1].name)
                
                // Check response data
                expect(response.body[0].events[0]).toBe(data[0].events[0].toJSON());
                
                
            })
    })

})
