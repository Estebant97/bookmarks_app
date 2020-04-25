const uuid = require("uuid");
let posts = [
    {
        id: uuid.v4(),
        title: "Youtube", 
        description: "videos",
        url: "https://www.youtube.com",
        rating: 1
    }, 
    {
        id: uuid.v4(),
        title: "Facebook", 
        description: "social media",
        url: "https://www.facebook.com",
        rating: 2
    },
    {
        id: uuid.v4(),
        title: "Twitter", 
        description: "social media",
        url: "https://www.twitter.com",
        rating: 3
    },
    {
        id: uuid.v4(),
        title: "Google", 
        description: "search",
        url: "https://www.google.com",
        rating: 4
    }
    ];
module.exports = posts;