const dH = require('./dataHandler');
const myEmitter = require('./myEmitter');
const schedule = require('node-schedule');
const griddyURL = 'https://app.gogriddy.com/api/v1/insights/getnow';
const griddyParams = {settlement_point:'LZ_WEST'};
const priceSpikePrices =[30.0, 9.0, 6.0];//Most Severe, Moderately Severe, Least Severe
var currentPriceSpike = 0; 
//=================================================================================================================
//                                      Function to Look For Price Spikes From Griddy
//=================================================================================================================
function priceSpikeCheck(dataIn){
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
async function griddyMainLoop(){
    try{
        var axData = await dH.postHTTP(griddyURL, griddyParams);
        let resData = axData.data.now;
        dH.dbInsert('griddyData', resData);
        priceSpikeCheck(resData);
        myEmitter.emit('newPrice', resData.price_ckwh);
    } 
    catch(err){
        console.error(err);
    }
}
var griddyRule = new schedule.RecurrenceRule();
griddyRule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 55];
var griddySchedule = schedule.scheduleJob(griddyRule, () =>{griddyMainLoop();});
//=================================================================================================================
//                                                Exports
//=================================================================================================================
module.exports.startup = griddyMainLoop; // Function to be called at startup of app to get initial griddy data