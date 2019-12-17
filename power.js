// power.js is responsible for connection to griddy and performing all power related calculations and loogging
const https = require('https')
// Variables and Constant Declarations
const tduPrice = 6.0;
var griddyPrice = 0.0;
var secondsUntilRefresh = 0; // Used to store the seconds until new Griddy data is available
// var body =''; // Used to store the body of the response from griddy
// var parsed = {}; // Used to store the parsed JSON object after parsing the body from the http response

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
async function getGriddyData(postData, postOptions){
    var body = '';
    const req = https.request(postOptions, res => {
    // console.log(`statusCode: ${res.statusCode}`)
    var chunks = '';

    res.on("data", function (chunk) {
      console.log(chunk.length)
      chunks += chunk;
    });
    
    // res.on('data', d => {
    //     console.log(d);
    //     //console.log(body);
    //     body += d;
    //     // console.log("HTTP Request Sent");
    // })
    res.on('end', function() {
        // console.log('test');
        const object = JSON.parse(chunks)
        console.log(object);
        console.log(object.now.price_ckwh);
    });
  })
  req.on('error', error => {
    console.error(error)
  })
  req.write(postData)
  req.end()
  return body;
}
// End of HTTP POST Request COde
function parseData(unparsedData){
    // console.log(unparsedData);
    var parsedData = JSON.parse(unparsedData);
    console.log(parsedData.now.price_ckwh);
    return parsedData;
}
function griddyDoStuff(dataIn){
    secondsUntilRefresh = parseInt(dataIn.seconds_until_refresh);
    console.log("Time Till New Data Available: " + secondsUntilRefresh);
    console.log(dataIn.now.price_ckwh);
    exports.price = tduPrice + parseFloat(dataIn.now.price_ckwh);
}
async function doStuff(){
try{
    var griddyData = await getGriddyData(data, options);
    // var griddyJson = await parseData(griddyData);
    // griddyDoStuff(griddyJson);
}
catch(err){
    console.error(err);
    // console.log(griddyData);
}

}
//getGriddyData();
// getGriddyData();
doStuff();
var griddyInterval = setInterval(doStuff, 60000);

exports.price = tduPrice + griddyPrice;
exports.kwh = 200;