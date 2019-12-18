const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')

//set constants for things such as high price, pump timeout
const poolHiPrice = 15; //Price that triggers hi price shutdown
const poolHiPriceTimeout = 1800000; //Timeout in milliseconds
var hiShutdown = false;
var poolOffTime = 0;

//MQTT Testcode to connect to MQTT and send messages on an interval
client.on('connect', () => {
       //client.publish('home/pool/pump/cmnd/Power1', 'ON')
       client.subscribe('home/pool/pump/stat/POWER1')
       client.subscribe('home/pool/pump/stat/POWER2')
       client.subscribe('home/pool/pump/stat/POWER3')
       client.subscribe('home/pool/pump/stat/POWER4')
       console.log("MQTT Connected")
})

client.on('message', (topic, message) => {
    switch (topic) {
      case 'home/pool/pump/stat/POWER1':
        return getPumpSpeed(1)
      case 'home/pool/pump/stat/POWER2':
        return getPumpSpeed(2)
      case 'home/pool/pump/stat/POWER3':
        return getPumpSpeed(3)
      case 'home/pool/pump/stat/POWER4':
        return getPumpSpeed(4)
    }
    console.log('No handler for topic %s', topic)
  })
  
  
function test() {
    client.publish('home/pool/pump/cmnd/Power1', 'ON')
}
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
   switch(desiredSpeed){
        case 1:
            client.publish('home/pool/pump/cmnd/Power1', 'ON') 
        case 2:
            client.publish('home/pool/pump/cmnd/Power2', 'ON') 
        case 3:
            client.publish('home/pool/pump/cmnd/Power3', 'ON')
        case 4:
            client.publish('home/pool/pump/cmnd/Power4', 'ON')  

   }
    console.log('Speed Set');
}
//=======================================================================================
//                                  Set Pump Speed Function End
//=======================================================================================


//=======================================================================================
//                     Hi Price Override Function Start
//=======================================================================================
function pumpHiPriceOverride(hi, current){
    if(!hiShutdown && current >= hi){
        setPumpSpeed(1);
        hiShutdown = true;
        console.log('Hi Price Shutdown Started')

    }
    else if(hiShutdown && poolOffTime <= poolHiPriceTimeout){

    }
    else if(hiShutdown){
        hiShutdown = false;
        console.log('Hi Price Shutdown Over')
    }
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