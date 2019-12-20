const dataHandler = require('./dataHandler')
const mqtt = require('mqtt')
const scheduler = require('./scheduler')
const dateFNS = require('date-fns')
const client = mqtt.connect('mqtt://localhost:1883')
var home ={
    "pool": {
        "pumpOff": {
          "schedule":[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          "topic": 'home/pool/pump/cmnd/POWER1',
          "onMessage": 'ON'
        },
        "pumpLow": {
            "schedule":[0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
            "topic": 'home/pool/pump/cmnd/POWER2',
            "onMessage": 'ON'
        },
        "pumpMed": {
            "schedule": [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
            "topic": 'home/pool/pump/cmnd/POWER3',
            "onMessage": 'ON'
        },
        "pumpHi": {
            "schedule":[0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
            "topic": 'home/pool/pump/cmnd/POWER4',
            "onMessage": 'ON'
        }
   
    }
  };

//set constants for things such as high price, pump timeout
const poolHiPrice = 15; //Price that triggers hi price shutdown
const poolHiPriceTimeout = 1800000; //Timeout in milliseconds
var hiShutdown = false;
var poolOffTime = 0;


client.on('connect', () => {
       client.subscribe('home/pool/pump/stat/POWER1')
       client.subscribe('home/pool/pump/stat/POWER2')
       client.subscribe('home/pool/pump/stat/POWER3')
       client.subscribe('home/pool/pump/stat/POWER4')
})

client.on('message', (topic, message) => {
    if(message = 'ON'){
    switch (topic) {
      case 'home/pool/pump/stat/POWER1':
        return getPumpSpeed(1)
      case 'home/pool/pump/stat/POWER2':
        return getPumpSpeed(2)
      case 'home/pool/pump/stat/POWER3':
        return getPumpSpeed(3)
      case 'home/pool/pump/stat/POWER4':
        return getPumpSpeed(4)
    }}
    console.log('No handler for topic %s', topic)
  })
  
  

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
    client.publish(topic, 'ON')
    dataHandler.dbInsert('poolData', {'date': new Date().getTime(), 'speed': desiredSpeed})
}
//=======================================================================================
//                                  Set Pump Speed Function End
//=======================================================================================


//=======================================================================================
//                             Hi Price Override Function Start
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
function poolScheduler(array, topic, command){
    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    if(array[currentHour] == 1){ 
console.log("Running " + topic + " at " + currentHour)
    }
}

//=======================================================================================
//                       Pool Scheduler Function End
//=======================================================================================

//=======================================================================================
//
//=======================================================================================



scheduler('mqtt', home.pool.pumpOff.schedule, home.pool.pumpOff.topic, home.pool.pumpOff.onMessage);
scheduler('mqtt', home.pool.pumpLow.schedule, home.pool.pumpLow.topic, home.pool.pumpLow.onMessage);
scheduler('mqtt', home.pool.pumpMed.schedule, home.pool.pumpMed.topic, home.pool.pumpMed.onMessage);
scheduler('mqtt', home.pool.pumpHi.schedule, home.pool.pumpHi.topic, home.pool.pumpHi.onMessage);
