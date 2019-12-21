const dataHandler = require('./dataHandler')
const myEmitter = require('./myEmitter')
const schedule = require('node-schedule')
const axios = require('axios')

const tduPrice = 6.0;
const priceSpikePrice = 9.0;
var priceSpike = false;


//=================================================================================================================
//                                              End of Variables 
//=================================================================================================================



//=================================================================================================================
//                                      Function to do Stuff With Data From Griddy
//=================================================================================================================
function griddyDoStuff(dataIn){
    if(dataIn.price_ckwh >= priceSpikePrice && !priceSpike){
        myEmitter.emit('priceSpike', true);
    }
    else if(dataIn.price_ckwh < priceSpikePrice && priceSpike){
        myEmitter.emit('priceSpike', false);
    }
}
//=================================================================================================================
//                               End of Function to do Stuff With Data From Griddy
//=================================================================================================================


//=================================================================================================================
//                  Code Block Used to Call Functions In Order Every 5 Minutes WHen Data Is Available
//=================================================================================================================
               
async function doStuff(){
    try{
        var axData = await axios.post('https://app.gogriddy.com/api/v1/insights/getnow', {settlement_point:'LZ_WEST'})
        .then(function (response) {
            let resData = response.data.now;
            dataHandler.dbInsert('griddyData', resData)
            griddyDoStuff(resData);
        })
        .catch(function (error) {
        console.log(error);
        });
    } 
    catch(err){
        console.error(err);
    }
}

var griddyRule = new schedule.RecurrenceRule();
griddyRule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 55];
var j = schedule.scheduleJob(griddyRule, function(){
   doStuff();
});

//=================================================================================================================
//           End of Code Block Used to Call Functions In Order Every 5 Minutes WHen Data Is Available
//=================================================================================================================


//=================================================================================================================
//                              
//=================================================================================================================
