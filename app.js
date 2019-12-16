'use strict';
const power = require('./power')
const https = require('https')
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')

//set constants for things such as high price, tdu charges, pump timeout
const hiPrice = 15; //Price that triggers hi price shutdown of power hungry devices
const hiPriceTimeout = 1800000; //Timeout in milliseconds

//MQTT Testcode to connect to MQTT and send messages on an interval
client.on('connect', () => {
       client.publish('home/pool/pump/cmnd/Power1', 'ON')
       console.log("MQTT Connected")
})
function test() {
    client.publish('home/pool/pump/cmnd/Power1', 'ON')
    console.log("Sending MQTT Data");
    console.log(power.price);
}
var intervalid = setInterval(test, 60000);


// http post test code to attempt to connect to griddy api and get json object back
const data = '{"settlement_point":"LZ_WEST"}';

const options = {
   hostname: 'app.gogriddy.com',
   port: 443,
   path: '/api/v1/insights/getnow',
   method: 'POST',
   headers: {
       'Content-Type': 'application/json',
       'Content-Length': data.length,
   },
   //body: {'settlement_point':'LZ_WEST'}
}
// const data = {"settlement_point":"LZ_WEST"};

var body ='';
const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    // console.log('Body: ' + body);
   // console.log('Headers: ' + JSON.stringify(res.headers));
    res.on('data', d => {
     //process.stdout.write(d)
     body += d;
     //console.log(body);
     try {
        const parsed = JSON.parse(body)
      } catch(err) {
        console.error(err)
      }
      
    })
  })
  
  req.on('error', error => {
    console.error(error)
  })
  
  req.write(data)
  req.end()
  //var parsed = JSON.parse(body);
  
                                
// var req = https.request(options, function (res) {
//    console.log('Status: ' + res.statusCode);
//    console.log('Headers: ' + JSON.stringify(res.headers));
//    res.setEncoding('utf8');
//    res.on('data', function (body) {
//        console.log('Body: ' + body);
//    });
// });
// req.on('error', function (e) {
//    console.log('problem with request: ' + e.message);
//    console.log(data.length);
// });

//Get Griddy price every 5 minutes

