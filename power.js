const dataHandler = require('./dataHandler')
const axios = require('axios')
// power.js is responsible for connection to griddy and performing all power related calculations and loogging
// Variables and Constant Declarations
const tduPrice = 6.0;
var griddyPrice = 0.0;
var secondsUntilRefresh = 0; // Used to store the seconds until new Griddy data is available
var latestGriddyData = {};

function isEmpty(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
}
//=================================================================================================================
//                                              End of Variables 
//=================================================================================================================



//=================================================================================================================
//                                      Function to do Stuff With Data From Griddy
//=================================================================================================================
function griddyDoStuff(dataIn){
    secondsUntilRefresh = parseInt(dataIn.seconds_until_refresh);
    console.log("Time Till New Data Available: " + secondsUntilRefresh);
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
    
    var axData = await axios.post('https://app.gogriddy.com/api/v1/insights/getnow', {settlement_point:'LZ_WEST'})
    .then(function (response) {
        let resData = response.data.now;
        dataHandler.dbInsert('griddyData', resData)
      })
      .catch(function (error) {
        console.log(error);
      });
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