require('dotenv').config()
const mongoose = require("mongoose")
const create_server = require("../server")
var Channel = require('../models/channel');
var Provider = require('../models/provider');
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
            state: "MO"
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
                description: "Kansas city, MO", 
                state: "MO",
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
                state: "MO",
                description: "Kansas city, MO",
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

describe("v1/providers endpoints integration tests", () => {
    
    let provider;
    let prov_channel;
    //~ let date1;
    //~ let date2;
    
    beforeAll( async () => {
        //~ date1 = new Date('December 19, 2021 09:06:00Z');
        //~ date2 = new Date('December 17, 2021 016:55:00Z');
    });
    
    beforeEach( async () => {
        console.log("creating new instance of Provider...");
        
        prov_channel = await Channel.create({
            name: "COL",
            description: "Columbia, MO, USA",
            state: "MO"
        })
        
        provider = await Provider.create({
            name: "Shrewsbury Superstore",
            address1: "1234 Walmart st",
            city: "St. Louis",
            state: "MO",
            country: "USA",
            zip: 63104,
            tags: ["apointment"], //needs review,
            source_name: "vaccinefinder.gov",
            source_url: "www.walmart.com",
            contact_url: "www.walmart.com/pharmacy/covid",
            channels: [prov_channel.id],
        })
    });
    
    afterEach( async() => {
        console.log("deleting provider");
        await Provider.deleteMany();
        await Channel.deleteMany();
    });
    
    test("GET v1/providers", async () => {

        await supertest(app)
            .get("/v1/providers")
            .expect(200)
            .then((response) => {
                // Check the response type and length
                expect(Array.isArray(response.body)).toBeTruthy()
                expect(response.body.length).toEqual(1)

                // Check the response data
                expect(response.body[0]._id).toBe(provider.id)
                expect(response.body[0].name).toBe(provider.name)
                expect(response.body[0].channels.length).toBe(provider.channels.length)
            })
    })
    
    test("GET v1/providers/:id", async () => {

        await supertest(app)
            .get("/v1/providers/" + provider.id)
            .expect(200)
            .then((response) => {
                // Check the response data
                expect(response.body._id).toBe(provider.id)
                expect(response.body.name).toBe(provider.name)
                expect(response.body.address1).toBe(provider.address1)
            })
    })
    
    test("DELETE v1/providers/:id", async () => {

        await supertest(app)
            .delete("/v1/providers/" + provider.id)
            .expect(200)
            .then(async (response) => {
                // Check the response data
                console.log(response.body.message)
                expect(await Provider.findOne({ _id: provider.id })).toBeFalsy()
            })
    })
    
    test("PATCH v1/providers/:id", async () => {
        
        const data = { 
                name: "Maplewood Pharmacy",
                address1: "1234 Walmart st",
                city: "St. Louis",
                state: "MO",
                zip: 63104,
                tags: ["apointment", "first-come"],
                contact_url: "www.walmart.com/pharmacy/covid",
                channels: [prov_channel.id],
            }
        
        await supertest(app)
            .patch("/v1/providers/" + provider.id)
            .send(data)
            .expect(200)
            .then(async (response) => {
                const updated_prov = await Provider.findOne({ _id: provider.id })
                expect(updated_prov).toBeTruthy()
                expect(updated_prov.name).toBe(data.name)
            })
    })
    
    test("POST v1/providers", async () => {
        
        const data = { 
                name: "South City Pharmacy",
                address1: "1245 Henrietta st",
                source_name: "vaccinefinder.gov",
                source_url: "www.walmart.com",
                city: "St. Louis",
                state: "MO",
                zip: 63104,
                tags: ["apointment", "first-come"], //needs review
                contact_url: "www.walmart.com/pharmacy/covid",
                channels: [prov_channel.id],
            }
        
        await supertest(app)
            .post("/v1/providers")
            .send(data)
            .expect(200)
            .then(async (response) => {
                //~ console.log(response)
                const new_prov = await Provider.findOne({ name: data.name })
                expect(new_prov).toBeTruthy()
                expect(new_prov.name).toBe(data.name)
                expect(new_prov.address1).toBe(data.address1)
            })
    })
    
    test("POST v1/providers/batch", async () => {
        
        
        let provider_no_events = await Provider.create({
            name: "Chuck E Cheeze",      //new prov w empty events
            source_name: "vaccinefinder.gov",
            source_url: "www.walmart.com",
            address1: "2225 Sesame Street",
            city: "St. Louis",
            state: "MO",
            country: "USA",
            zip: 63115,
            tags: ["appointment"],
            contact_url: "www.CEC.com/pharmacy/covid",
            channels: ["603728f58974f823c9e2a0d1"],
        })
        
        const data = [
            {
                name: "Shrewsbury Superstore",      //existing
                source_name: "vaccinefinder.gov",
                source_url: "www.walmart.com",
                address1: "1234 Walmart st",
                city: "St. Louis",
                state: "MO",
                country: "USA",
                zip: 63104,
                tags: ["apointment"],
                contact_url: "www.walmart.com/pharmacy/covid",
                channels: ["603728f58974f823c9e2a0d1"],
            },
            {
                name: "CVS Downtown",                   //new
                source_name: "vaccinefinder.gov",
                source_url: "www.walmart.com",
                cdc_id: 223,
                address1: "1234 Main st",
                city: "St. Louis",
                state: "MO",
                country: "USA",
                zip: 63104,
                tags: ["apointment"],
                contact_url: "www.CVS.com/pharmacy/covid",
                channels: ["603728f58974f823c9e2a0d1"],
            },
            {
                name: "Chuck E Cheeze",             //existing
                source_name: "vaccinefinder.gov",
                source_url: "www.walmart.com",
                cdc_id: 515483241584,
                address1: "2225 Sesame Street",
                city: "St. Louis",
                state: "MO",
                country: "USA",
                zip: 63115,
                tags: ["appointment"],
                contact_url: "www.CEC.com/pharmacy/covid",
                channels: ["603728f58974f823c9e2a0d1"],
            }
        ]
        
        
        await supertest(app)
            .post("/v1/providers/batch")
            .send(data)
            .expect(200)
            .then(async (response) => {
                // Check response
                expect(Array.isArray(response.body)).toBeTruthy()
                expect(response.body.length).toEqual(3)

                // Check if we updated the existing event
                const new_prov_0 = await Provider.findOne({ name: data[0].name })
                
                // Check if we created new events
                const new_prov_1 = await Provider.findOne({ name: data[1].name })
                expect(new_prov_1).toBeTruthy()
                expect(new_prov_1.name).toBe(data[1].name)
                console.log(response.body)
                // Check response data
                
                
            })
    })

})
