//NPM and Node Modules
const express = require('express');
const https = require('https');
const mongo = require('mongodb').MongoClient;
const fs = require('fs');
const path = require('path');

//Config
const config = require('./config/config_dev.js');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const sslOptions = config.sslOptions;

//Init of express app
const app = express();

//Static middleware
//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

///Route handlers
app.get('/api/imgsearch', (req, res) => {
    console.log(req.query.q);

    let responseJson;

    bingImageSearch(req.query.q)
        .then(bingResponseHandler)
        .then(formattedBingRes => {
            responseJson = formattedBingRes;
            //console.log('the response JSON is ' + responseJson);
            res.end(responseJson);
        })
        .catch(error => console.log(error));

});

//Listening
app.listen(8080);
https.createServer(sslOptions, app).listen(443);

//Named function declarations
function bingImageSearch(imgSearchQuery) {
    return new Promise((resolve, reject) => {
        let requestParams = {
            method: 'GET',
            hostname: config.apiHost,
            path: config.apiEndPoint + '?q=' + encodeURIComponent(imgSearchQuery),
            headers: {
                'Ocp-Apim-Subscription-Key': config.apiKey1
            }
        };

        let req = https.request(requestParams, (bingResponse) => {
            //console.log('about to make request or ' + bingResponse);
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
        //console.log('the promise returned ' + bingResponse);

        let bingResultsObj = '';
        bingResponse.on('data', d => {
            bingResultsObj += d;
        });
        bingResponse.on('end', () => {
            //console.log('\nRelevant Headers:\n');
            for (var header in bingResponse.headers) {
                // header keys are lower-cased by Node.js
                if (header.startsWith("bingapis-") || header.startsWith("x-msedge-")) {
                    console.log(header + ": " + bingResponse.headers[header]);
                }
            }
            //bingResultsObj = JSON.stringify(JSON.parse(bingResultsObj), null, '  ');
            //console.log('\nJSON Response:\n');
            //console.log(bingResultsObj);
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

}