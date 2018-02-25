//NPM and Node Modules
const express = require('express');
//const https = require('https');
const mongo = require('mongodb').MongoClient;
const fs = require('fs');
const path = require('path');

//Config
const config = require('./config/config_devC9.js');
//const sslOptions = config.sslOptions;

//Init of express app
const app = express();

//Static middleware
//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

///Route handlers
app.get('/api/imgsearch', (req, res) => {
    let queryObj = {
        searchStr: req.query.q,
        count: req.query.count,
        offset: req.query.offset
    };
    console.log(queryObj);
    
    recordSearchInDb(queryObj.searchStr);

    bingImageSearch(queryObj)
        .then(bingResponseHandler)
        .then(formattedBingRes => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(formattedBingRes);
        })
        .catch(error => {throw error});

});

app.get('/api/recent', (req, res) => {

    returnRecentSearches().then(recentSearches => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(recentSearches);
    }).catch(error => {throw error});
});

app.all('/*', (req, res) => {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not found. Please submit a search query with the /api/imgsearch endpoint");
});

//Listening
app.listen(config.port);
//https.createServer(sslOptions, app).listen(config.HTTPSPort);

//Named function declarations
function bingImageSearch(imgQueryObj) {
    return new Promise((resolve, reject) => {
        let queryStringPath = config.apiEndPoint + '?q=' + encodeURIComponent(imgQueryObj.searchStr);
        if(imgQueryObj.count !== undefined && !isNaN(imgQueryObj.count)){queryStringPath += '&count=' + imgQueryObj.count}
        if(imgQueryObj.offset !== undefined && !isNaN(imgQueryObj.offset)){queryStringPath += '&offset=' + imgQueryObj.offset}

        let requestParams = {
            method: 'GET',
            hostname: config.apiHost,
            path: queryStringPath,
            headers: {
                'Ocp-Apim-Subscription-Key': config.apiKey1
            }
        };

        let req = https.request(requestParams, (bingResponse) => {
            if (bingResponse) {
                resolve(bingResponse);
            } else {
                reject('http request failed');
            }
        });
        req.end();
    });
}

function bingResponseHandler(bingResponse) {
    return new Promise((resolve, reject) => {
        let bingResultsObj = '';
        bingResponse.on('data', d => {
            bingResultsObj += d;
        });
        bingResponse.on('end', () => {
            console.log('\nRelevant Headers:\n');
            for (var header in bingResponse.headers) {
                // header keys are lower-cased by Node.js
                if (header.startsWith("bingapis-") || header.startsWith("x-msedge-")) {
                    console.log(header + ": " + bingResponse.headers[header]);
                }
            }
            bingResultsObj = JSON.parse(bingResultsObj);

            let bingResultsArr = bingResultsObj.value;
            let imgSearchResults = [];
            
            bingResultsArr.map(obj => {
                obj = {
                    name: obj.name,
                    url: obj.contentUrl,
                    thumbnail: obj.thumbnailUrl,
                    page: obj.hostPageUrl
                };
                imgSearchResults.push(obj);
            });
            
            resolve(JSON.stringify(imgSearchResults, null, "\t"));
        });
        bingResponse.on('error', function (err) {
            console.log('Error: ' + err.message);
            reject(err);
        });
    });
}

function recordSearchInDb(imgSearchQuery) {
    mongo.connect(config.mongoUri, (err, db) => {
        if (err) throw err;
        let dbo = db.db(config.dbName);
        dbo.collection(config.collectionName).insertOne({search: imgSearchQuery, dateTime: Date.now()}, (err,result) =>{
            if (err) throw err;
            db.close();
        });
    });
}

function returnRecentSearches(){
    return new Promise((resolve, reject) => {
    let recentSearchArr = [];
    mongo.connect(config.mongoUri, (err, db) => {
        if (err) {reject(err)}
        let dbo = db.db(config.dbName);
        dbo.collection(config.collectionName).find({}, {fields: {_id: 0}}).sort({
            'dateTime': -1
        }).limit(10).forEach(doc => recentSearchArr.push(doc), (err) => {
            if (err) {reject(err)}
            resolve(JSON.stringify(recentSearchArr, null, "\t"));
            db.close();
        });
    });

    });
}