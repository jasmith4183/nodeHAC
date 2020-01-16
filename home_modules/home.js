

var home ={
    "pool": {
        "pumpOff": {
          "schedule":[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          "topic": 'home/pool/pump/cmnd/POWER1',
          "onMessage": 'ON',
          "offMessage": 'OFF',
          "priceShutdown": 1,
          "priceShutdownMode": 'ON',
          "currentState": 'ON'
        },
        "pumpLow": {
            "schedule":[0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
            "topic": 'home/pool/pump/cmnd/POWER2',
            "onMessage": 'ON',
            "offMessage": 'OFF',
            "priceShutdown": 0,
            "priceShutdownMode": 'ON',
            "currentState": 'OFF'
        },
        "pumpMed": {
            "schedule": [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
            "topic": 'home/pool/pump/cmnd/POWER3',
            "onMessage": 'ON',
            "offMessage": 'OFF',
            "priceShutdown": 0,
            "priceShutdownMode": 'ON',
            "currentState": 'OFF'
        },
        "pumpHi": {
            "schedule":[0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
            "topic": 'home/pool/pump/cmnd/POWER4',
            "onMessage": 'ON',
            "offMessage": 'OFF',
            "priceShutdown": 0,
            "priceShutdownMode": 'ON',
            "currentState": 'OFF'
        }
   
    },
    "living": {
        "light": {
            "schedule":[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
            "topic": 'home/living/light/cmnd/POWER1',
            "onMessage": 'ON',
            "offMessage": 'OFF',
            "priceShutdown": 1,
            "priceShutdownMode": 'ON',
            "currentState": 'ON'
          } 
    }
  };
//===

function getRoom(roomName){
 //return json object of room
 console.log(home[roomName]);
}
function getDevice(roomName, deviceName){
 // return json object of device
 console.log(home[roomName][deviceName]);
}
function setCurrentState(statusTopic){
    // find device based on topic and set state accordingly

}

function parseHome(parseKey){

  Object.keys(home).forEach(function(key){
    console.log(key);

    Object.keys(home[key]).forEach(function(keyKey){
        console.log(keyKey + '=' + home[key][keyKey][parseKey]);
     });
    
 });
}

 
  module.exports.room = getRoom;
  module.exports.device = getDevice;
  module.exports.setState = setCurrentState;
  module.exports.parse = parseHome;