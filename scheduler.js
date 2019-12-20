const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')

function scheduler(controlType, array, topic, message){
    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    if(array[currentHour] == 1){ 
        if(controlType == 'mqtt'){
            client.publish(topic, message)
        }
console.log("Running " + topic + " at " + currentHour)
    }
}
module.exports  = scheduler;