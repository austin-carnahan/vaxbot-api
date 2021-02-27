let date1 = new Date('December 19, 2021 09:06:00Z');
let date2 = new Date('December 17, 2021 016:55:00Z');
let date3 = new Date('April 12, 2021 7:45:00Z');
let date4 = new Date('June 6, 2021 12:32:00Z');

let locations = [
    {
        name: "Shrewsbury Superstore",
        parent: "Walmart",
        store_id: 1234,
        address1: "1234 Walmart st",
        city: "St. Louis",
        state: "MO",
        country: "USA",
        zip: 63104,
        events: [],
        tags: ["apointment"], 
        signup_url: "www.walmart.com/pharmacy/covid",
        channels: ["603728f58974f823c9e2a0d1"],
    },
    { 
        name: "Maplewood Pharmacy",
        parent: "Walgreens",
        address1: "1234 Walmart st",
        city: "St. Louis",
        state: "MO",
        zip: 63104,
        events: [date3],
        tags: ["apointment", "first-come"], 
        signup_url: "www.walmart.com/pharmacy/covid",
        channels: ["603728f58974f823c9e2a0d1"],
    },
    { 
        name: "South City Pharmacy",
        parent: "CVS",
        address1: "1245 Henrietta st",
        city: "St. Louis",
        state: "MO",
        zip: 63104,
        events: [date1, date2],
        tags: ["apointment", "first-come"], 
        signup_url: "www.walmart.com/pharmacy/covid",
        channels: ["603728f58974f823c9e2a0d1"],
    },
    {
        name: "Chuck E Cheeze",      
        parent: "Mickey",
        store_id: 515483241584,
        address1: "2225 Sesame Street",
        city: "St. Louis",
        state: "MO",
        country: "USA",
        zip: 63115,
        events: [date2, date3, date4],
        tags: ["appointment"],
        signup_url: "www.CEC.com/pharmacy/covid",
        channels: ["603728f58974f823c9e2a0d1"],
    },
    {
        name: "CVS Downtown",                  
        parent: "CVS",
        store_id: 2,
        address1: "1234 Main st",
        city: "St. Louis",
        state: "MO",
        country: "USA",
        zip: 63104,
        events: [date1, date2, date3, date4],
        tags: ["apointment"],
        signup_url: "www.CVS.com/pharmacy/covid",
        channels: ["603728f58974f823c9e2a0d1"],
    },

]

module.exports = locations
