var dataHandler = require('./dataHandler')
var myEmitter = require('./myEmitter')
    myEmitter.on('priceSpike', (priceSpikeSeverity) => { priceSpike(priceSpikeSeverity) });
const schedule = require('node-schedule')
var myDevices = [];


class Device{
    constructor(room, name, onTime, offTime){
        this.onTime = schedule.scheduleJob(onTime, this.turnOn.bind(this));
        this.offTime = schedule.scheduleJob(offTime, this.turnOff.bind(this));
        this.type = '';//switch, dimmer, virtual, etc.....
        this.name = name;
        this.room = room;
        this.description ='';//user friendly name
        this.cmndTopic = 'home/pool/pump/cmnd/POWER1';
        this.statTopic = 'home/pool/pump/stat/POWER1';
        this.onMessage = 'ON';
        this.offMessage = 'OFF';
        this.priceShutdown = 3; // 0 for none 1-3 for different severity levels
        this.priceShutdownMode = 'OFF';
        this.resumeAfterShutdown = true;
        this.preShutdownState = '';
        this.currentState = 'ON';
    }
    turnOff(){
        console.log(this.name +' Turned Off');
        // dataHandler.sendMqttMessages(this.cmndTopic, this.offMessage)
        return [this.cmndTopic, this.offMessage];
    }
    turnOn(){
        console.log(this.name +' Turned On');
        // dataHandler.sendMqtt(this.cmndTopic, this.onMessage);
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
function priceSpike(p){
    console.log('Devices Sees Price Spike Level: ' + p);
    myDevices.forEach((D) => {
            // console.log(D.name + ' Sees Price Spike Level: ' + priceSpikeSeverity);
            // console.log(D.name + ' Has Price Spike Level: ' + D.priceShutdown);
       if(0 != D.priceShutdown && D.priceShutdown <= p){
            console.log('Price Shutdown for Device');
            D.hiPriceShutdown();
        }
    })
}
//Test Devices
myDevices = [
    new Device('pool', 'pumpOff', '48 * * * *', '49 * * * *'), 
    new Device('pool', 'pumpLo', '48 * * * *', '49 * * * *'), 
    new Device('pool', 'pumpMed', '48 * * * *', '49 * * * *'),
    new Device('pool', 'pumpHi', '48 * * * *', '49 * * * *')
];
myDevices[1].cmndTopic = 'home/pool/pump/cmnd/POWER2';
myDevices[1].statTopic = 'home/pool/pump/stat/POWER2';
myDevices[2].cmndTopic = 'home/pool/pump/cmnd/POWER3';
myDevices[2].statTopic = 'home/pool/pump/stat/POWER3';
myDevices[3].cmndTopic = 'home/pool/pump/cmnd/POWER4';
myDevices[3].statTopic = 'home/pool/pump/stat/POWER4';

myDevices[0].priceShutdownMode = 'ON';
//test code to filter by room-- works
// const filteredDevices = myDevices.filter((device)=> {
//     return device.room === 'living';
// })
// console.log(filteredDevices);
//==========================================
module.exports = Device;
module.exports.myDevices = myDevices