const dataHandler = require('./dataHandler')
const myEmitter = require('./myEmitter')
const schedule = require('node-schedule')
const axios = require('axios')

const priceSpikePrices =[30.0, 9.0, 1.0];//Most Severe, Moderately Severe, Least Severe
var currentPriceSpike = 0; 
//=================================================================================================================
//                                      Function to do Stuff With Data From Griddy
//=================================================================================================================
function griddyDoStuff(dataIn){
    priceSpikePrices.forEach((price, key) => {
        key += 1;
        if(dataIn.price_ckwh >= price && currentPriceSpike != key){
            myEmitter.emit('priceSpike', key);
            console.log('Griddy Sent Price Spike Level: ', key);
            currentPriceSpike = key;
            return currentPriceSpike;
        }     
        else if(dataIn.price_ckwh < priceSpikePrices[2] && currentPriceSpike != 0){
            console.log('Griddy Price Spike Over');
            currentPriceSpike = 0;
            return currentPriceSpike;
        }
    })
}
//=================================================================================================================
//                  Code Block Used to Call Functions In Order Every 5 Minutes WHen Data Is Available
//=================================================================================================================          
async function getData(){
    try{
        var axData = await axios.post('https://app.gogriddy.com/api/v1/insights/getnow', {settlement_point:'LZ_WEST'})
        .then(function (response) {
           
            let resData = response.data.now;
            dataHandler.dbInsert('griddyData', resData);
           
            griddyDoStuff(resData);
            return resData;
        })
        .catch(function (error) {
        console.log(error);
        });
    } 
    catch(err){
        console.error(err);
    }
    console.log(axData);
}
var griddyRule = new schedule.RecurrenceRule();
griddyRule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 55];
var j = schedule.scheduleJob(griddyRule, function(){
   getData();
});
//=================================================================================================================
//                                                Exports
//=================================================================================================================
module.exports.startup = getData; // Function to be called at startup of app to get initial griddy data