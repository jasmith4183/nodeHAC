'use strict';
const power = require('./power')
//const https = require('https')
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')

//set constants for things such as high price, tdu charges, pump timeout


//MQTT Testcode to connect to MQTT and send messages on an interval
client.on('connect', () => {
       client.publish('home/pool/pump/cmnd/Power1', 'ON')
})
function test() {
    client.publish('home/pool/pump/cmnd/Power1', 'ON')
    console.log("Sending MQTT Data");
    console.log(power.price);
}
var intervalid = setInterval(test, 5000);


//http post test code to attempt to connect to griddy api and get json object back
//const options = {
//    hostname: 'app.gogriddy.com',
//    port: 443,
//    path: '/api/v1/insights/getnow',
//    method: 'POST',
//    headers: {
//        'Content-Type': 'application/json',
       
//    }
//}

//var req = https.request(options, function (res) {
//    console.log('Status: ' + res.statusCode);
//    console.log('Headers: ' + JSON.stringify(res.headers));
//    res.setEncoding('utf8');
//    res.on('data', function (body) {
//        console.log('Body: ' + body);
//    });
//});
//req.on('error', function (e) {
//    console.log('problem with request: ' + e.message);
//});

//Get Griddy price every 5 minutes

