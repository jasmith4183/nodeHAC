const dataHandler = require('./dataHandler')
const schedule = require('node-schedule')
const myEmitter = require('./myEmitter')

//set constants for things such as high price, pump timeout
const poolHiPriceTimeout = 1800000; //Timeout in milliseconds
var hiShutdown = false;
var poolOffTime = 0;
//=======================================================================================
//                               Get Pump Speed Function Start
//=======================================================================================
function getPumpSpeed(speed){
// Sned MQTT status command via client.publish
//Listen for response using client.subscribe
console.log(speed)
}
//=======================================================================================
//                                  Get Pump Speed Function End
//=======================================================================================


//=======================================================================================
//                               Set Pump Speed Function Start
//=======================================================================================
function setPumpSpeed(desiredSpeed){
    let topic = 'home/pool/pump/cmnd/Power' + desiredSpeed;
    dataHandler.sendMqtt(topic, 'ON');
    dataHandler.dbInsert('poolData', {'date': new Date().getTime(), 'speed': desiredSpeed})
}
//=======================================================================================
//                                  Set Pump Speed Function End
//=======================================================================================


//=======================================================================================
//                             Hi Price Override Function Start
//=======================================================================================
function pumpHiPriceShutdown(priceSpike){
    
        if(priceSpike >=1 && !hiShutdown){
            setPumpSpeed(1);
            hiShutdown = true;
            console.log('Hi Price Shutdown Started');
        }
        else if(priceSpike >= 1 && hiShutdown){
            console.log('Hi Price Shutdown Still In Effect');
        }
        else if(!priceSpike < 1 && hiShutdown){
            hiShutdown = false;
            console.log('Hi Price Shutdown Ended');

        }
    
    // else if(hiShutdown && poolOffTime <= poolHiPriceTimeout){

    // }
    // else if(hiShutdown){
    //     hiShutdown = false;
    //     console.log('Hi Price Shutdown Over')
    // }
}

  myEmitter.on('priceSpike', (priceSpike) => {
    pumpHiPriceShutdown(priceSpike);

  });
 
//=======================================================================================
//                       Hi Price Override Function End
//=======================================================================================


//=======================================================================================
//                       Pool Scheduler Function Start
//=======================================================================================

// scheduler('mqtt', home.pool.pumpOff.schedule, home.pool.pumpOff.topic, home.pool.pumpOff.onMessage);
// scheduler('mqtt', home.pool.pumpLow.schedule, home.pool.pumpLow.topic, home.pool.pumpLow.onMessage);
// scheduler('mqtt', home.pool.pumpMed.schedule, home.pool.pumpMed.topic, home.pool.pumpMed.onMessage);
// scheduler('mqtt', home.pool.pumpHi.schedule, home.pool.pumpHi.topic, home.pool.pumpHi.onMessage);

//=======================================================================================
//                       Pool Scheduler Function End
//=======================================================================================

//=======================================================================================
//
//=======================================================================================