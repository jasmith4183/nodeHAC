const dataHandler = require('./dataHandler')
var myDevices = [];
class Device{
    constructor(room, name){
        this.name = name;
        this.room = room;
        this.description ='';
        this.schedule =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        this.cmndTopic = 'home/pool/pump/cmnd/POWER1';
        this.statTopic = 'home/pool/pump/stat/POWER1';
        this.onMessage = 'ON';
        this.offMessage = 'OFF';
        this.priceShutdown = 0; // 0 for none 1-3 for different severity levels
        this.priceShutdownMode = 'ON';
        this.resumeAfterShutdown = true;
        this.preShutdownState = '';
        this.currentState = 'ON';
    }
    turnOff(){
        console.log('Device Turned Off');
        dataHandler.sendMqtt(this.cmndTopic, this.offMessage)
        return [this.cmndTopic, this.offMessage];
    }
    turnOn(){

        console.log('Device Turned On');
        dataHandler.sendMqtt(this.cmndTopic, this.onMessage)
        return [this.cmndTopic, this.onMessage];
    }
    updateState(message){
        this.currentState = message;
        console.log('Device State Updated to ' + message);
    }
    checkState(){

    }
}




//Test Devices
myDevices = [new Device('living', 'pumpOff'), new Device('pool2', 'pumpLo'), new Device('pool', 'pumpMed'), new Device('pool', 'pumpHi')];
myDevices[1].statTopic = 'POWER2';
myDevices[2].statTopic = 'POWER3';
myDevices[3].statTopic = 'POWER4';
//test code to filter by room-- works
const filteredDevices = myDevices.filter((device)=> {
    return device.room === 'living';
})
console.log(filteredDevices);
//==========================================
module.exports = Device;
module.exports.myDevices = myDevices