const dataHandler = require('./dataHandler')
// power.js is responsible for connection to griddy and performing all power related calculations and loogging
const https = require('https')
// Variables and Constant Declarations
const tduPrice = 6.0;
var griddyPrice = 0.0;
var secondsUntilRefresh = 0; // Used to store the seconds until new Griddy data is available
var latestGriddyData = {};
const data = '{"settlement_point":"LZ_WEST"}'; // Data for POst Request
const options = { //Options for griddy http request
   hostname: 'app.gogriddy.com',
   port: 443,
   path: '/api/v1/insights/getnow',
   method: 'POST',
   headers: {
       'Content-Type': 'application/json',
       'Content-Length': data.length,
   },
}

function isEmpty(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
}
//=================================================================================================================
//                                              End of Variables 
//=================================================================================================================

//=================================================================================================================
//                                        HTTP POST Request Function
//=================================================================================================================
//  I was wanting this function to return the JSON object but can not seem to because its currently async code
//  and the return happens before the data has been collected and parsed
async function getHttpRequest(postData, postOptions){
    const req = https.request(postOptions, res => {
    // console.log(`statusCode: ${res.statusCode}`)
    var chunks = '';

    res.on("data", function (chunk) {
      //console.log(chunk.length)
      chunks += chunk;
    });
    
    res.on('end', function() {
        const object = JSON.parse(chunks)
        // console.log(object);
        latestGriddyData = object;
        dataHandler.mongoInsert('mongodb://localhost:27017/', 'mydb', 'griddyData', latestGriddyData);
    });
  })
  req.on('error', error => {
    console.error(error)
  })
  req.write(postData)
  req.end()
}
//=================================================================================================================
//                                             End of HTTP POST Request Function
//=================================================================================================================



//=================================================================================================================
//                                      Function to do Stuff With Data From Griddy
//=================================================================================================================
async function griddyDoStuff(dataIn){
    secondsUntilRefresh = parseInt(dataIn.seconds_until_refresh);
    console.log("Time Till New Data Available: " + secondsUntilRefresh);
    console.log(dataIn.now.price_ckwh);
    exports.price = tduPrice + parseFloat(dataIn.now.price_ckwh);
}
//=================================================================================================================
//                               End of Function to do Stuff With Data From Griddy
//=================================================================================================================


//=================================================================================================================
//                                 ASync/Await Function to run code Syncronously
//=================================================================================================================
//                This function needs to be moved to app.js so that other functions can be ran in line
//                 This code does not function as intended functions are strill running async
async function doStuff(){
try{
    var griddyData = await getHttpRequest(data, options);
    // console.log(griddyData);
    
    if(!isEmpty(latestGriddyData)){
      griddyDoStuff(latestGriddyData);  
      console.log(latestGriddyData);
      exports.griddyExportData = latestGriddyData;
    }
    
   
}
catch(err){
    console.error(err);
    // console.log(griddyData);
}

}

//=================================================================================================================
//                                  End of ASync/Await Function to run code Syncronously
//=================================================================================================================


//=================================================================================================================
//
//=================================================================================================================
doStuff();
var griddyInterval = setInterval(doStuff, 300000);

exports.price = tduPrice + griddyPrice;
exports.kwh = 200;