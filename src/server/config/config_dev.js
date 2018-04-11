const fs = require('fs');

module.exports= {
    port: 8080,
    HTTPSPort: 443,
    mongoUri: "mongodb://127.0.0.1:27017",
    dbName: "history",
    collectionName: "recent",
    apiKey1: "",
    apiKey2: "",
    apiHost: "api.cognitive.microsoft.com",
    apiEndPoint: "/bing/v7.0/images/search",
    sslOptions: {
        key: fs.readFileSync('./img-search-api/config/key.pem'),
        cert: fs.readFileSync('./img-search-api/config/cert.pem'),
        passphrase: "securepassphrase",
    }
}
