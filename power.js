// power.js is responsible for connection to griddy and performing all power related calculations and loogging
const https = require('https')
// Variables and Constant Declarations
var secondsUntilRefresh = 0; // Used to store the seconds until new Griddy data is available
var body =''; // Used to store the body of the response from griddy
var parsed = {}; // Used to store the parsed JSON object after parsing the body from the http response

// Start of HTTP POST Request Code
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
function getGriddyData(){
    body = '';
    parsed = {};
const req = https.request(options, res => {
    //console.log(`statusCode: ${res.statusCode}`)
    res.on('data', d => {
     body += d;
    // console.log(body);
    try {
        parsed = JSON.parse(body);
        secondsUntilRefresh = parseInt(parsed.seconds_until_refresh);
        console.log("Time Till New Data Available: " + secondsUntilRefresh);
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
}
// End of HTTP POST Request COde


//getGriddyData();
var griddyInterval = setInterval(getGriddyData, 60000);

exports.price =31;
exports.kwh = 200;