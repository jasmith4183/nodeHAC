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
}

//=======================================================================================
//                               Set Pump Speed Function Start
//=======================================================================================
function setPumpSpeed(desiredSpeed){

}
//=======================================================================================
//                                  Set Pump Speed Function End
//=======================================================================================


//=======================================================================================
//                     Hi Price Override Function Start
//=======================================================================================
function pumpHiPriceOverride(){
    
}
//=======================================================================================
//                       Hi Price Override Function End
//=======================================================================================


//=======================================================================================
//                       Pool Scheduler Function Start
//=======================================================================================


//=======================================================================================
//                       Pool Scheduler Function End
//=======================================================================================

//=======================================================================================
//
//=======================================================================================