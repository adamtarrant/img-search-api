const fs = require('fs');

module.exports= {
    port: 8080,
    HTTPSPort: 443,
    mongoUri: "mongodb://127.0.0.1:27017",
    dbName: "history",
    collectionName: "recent",
    apiKey1: "3340c6232d5f4118b4d47d0ba11a6ac8",
    apiKey2: "667d86e022fd4edfb7cabe2bf3144230",
    apiHost: "api.cognitive.microsoft.com",
    apiEndPoint: "/bing/v7.0/images/search",
    sslOptions: {
        key: fs.readFileSync('./img-search-api/config/key.pem'),
        cert: fs.readFileSync('./img-search-api/config/cert.pem'),
        passphrase: "securepassphrase",
    }
}