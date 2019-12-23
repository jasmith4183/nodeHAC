const schedule = require('node-schedule')
const dataHandler = require('./dataHandler')


function scheduler(controlType, array, topic, message){
    let currentDate = new Date();
    let currentHour = currentDate.getHours();
    if(array[currentHour] == 1){ 
        if(controlType == 'mqtt'){
            dataHandler.sendMqtt(topic, message);
        }
console.log("Running " + topic + " at " + currentHour)
    }
}
module.exports  = scheduler;
