const fs = require('fs');

module.exports= {
    port: process.env.PORT,
    mongoUri: process.env.MONGODB_URI,
    dbName: process.env.HISTORY_DB,
    collectionName: "recent",
    apiKey1: process.env.APIKEY1,
    apiKey2: process.env.APIKEY2,
    apiHost: "api.cognitive.microsoft.com",
    apiEndPoint: "/bing/v7.0/images/search",
}