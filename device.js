const dH = require('./dataHandler');
const fs = require('fs');
var  myEmitter = require('./myEmitter');
    myEmitter.on('priceSpike', (priceSpikeSeverity) => { priceSpikeHandler(priceSpikeSeverity) });
   myEmitter.on('deviceUpdate', (topic, message) => { deviceUpdater(topic, message) });
const schedule = require('node-schedule');
var myDevices = [];


class Device{
    constructor(newDevice){
        //Scheduling below works great so far.  Need to implement a system for allowing multiple times
        this.onTime = schedule.scheduleJob(newDevice.onTime, this.turnOn.bind(this));
       // this.offTime = schedule.scheduleJob(offTime, this.turnOff.bind(this));
        this.type = newDevice.type;//switch, dimmer, virtual, etc.....
        this.name = newDevice.name;
        this.room = newDevice.room;
        this.description ='';//user friendly name
        this.cmndTopic = newDevice.cmndTopic;
        this.statTopic = newDevice.statTopic;
        this.onMessage = newDevice.onMessage;
        this.offMessage = newDevice.offMessage;
        this.priceShutdown = newDevice.priceShutdown; // 0 for none 1-3 for different severity levels 1 Most Severe 3 Least Severe
        this.priceShutdownMode = newDevice.priceShutdownMode;
        this.resumeAfterShutdown = newDevice.resumeAfterShutdown;
        this.preShutdownState = '';
        this.currentState = 'ON';
        // myEmitter.on(this.statTopic, (state) => { 
        //     console.log(this.name + this.currentState);
        //     this.currentState = state ;
        //     console.log(this.name + this.currentState);
        // });
    }
    turnOff(){
        console.log(this.name +' Turned Off');
        dH.sendMqtt(this.cmndTopic, this.offMessage)
        return [this.cmndTopic, this.offMessage];
    }
    turnOn(){
        console.log(this.name +' Turned On');
        dH.sendMqtt(this.cmndTopic, this.onMessage);
        return [this.cmndTopic, this.onMessage];
    }
    updateState(message){
        this.currentState = message;
        console.log('Device State Updated to ' + message);
    }
    checkState(){

    }
    hiPriceShutdown(){
        if(this.priceShutdownMode = 'ON'){
            this.turnOn();
        }
        else if(this.priceShutdownMode = 'OFF'){
            this.turnOff();
        }

    }
}

//=======================================================================================
//                       Price Spike Function Ran When Listener Sees Price Spike
//=======================================================================================
function priceSpikeHandler(p){
    console.log('Devices Sees Price Spike Level: ' + p);
    myDevices.forEach((D) => {
            // console.log(D.name + ' Sees Price Spike Level: ' + priceSpikeSeverity);
            // console.log(D.name + ' Has Price Spike Level: ' + D.priceShutdown);
       if(0 != D.priceShutdown && D.priceShutdown <= p){
            // console.log('Price Shutdown for Device');
            D.hiPriceShutdown();
        }
    })
}
function deviceUpdater(topic, message){
    const filteredDevices = myDevices.find((device)=> {
        return device.statTopic === topic;
    })
    console.log(message);
    console.log(filteredDevices);
  filteredDevices.currentState = message;
    console.log(filteredDevices);

}
var myDevices = [];
async function createDevices(){
    var deviceArray = await fs.readFileSync('myDevices.json', 'utf8');
    deviceArray = await JSON.parse(deviceArray);
    deviceArray.forEach((item, index) =>{ 
    myDevices[index] = new Device(item);
    });
    console.log(myDevices.length + " Devices Created From myDevices.json");
}
createDevices();

//test code to filter by room-- works
// const filteredDevices = myDevices.filter((device)=> {
//     return device.room === 'living';
// })
// console.log(filteredDevices);
//==========================================\
// myDevices[1].turnOn();
module.exports = Device;
module.exports.myDevices = myDevices