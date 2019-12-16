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
   
}

var secondsUntilRefresh = 0;
var body ='';
var parsed = {};
const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    res.on('data', d => {
     body += d;
     console.log(body);
     try {
        parsed = JSON.parse(body)
        secondsUntilRefresh = parseInt(parsed.seconds_until_refresh);
        console.log(secondsUntilRefresh);
        console.log(parsed.now.price_ckwh);
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
 

//Get Griddy price every 5 minutes

