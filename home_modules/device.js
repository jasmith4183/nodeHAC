const dH = require('../dataHandler');
var  myEmitter = require('../myEmitter');
     myEmitter.on('priceSpike', (priceSpikeSeverity) => { priceSpikeHandler(priceSpikeSeverity) });
     myEmitter.on('deviceUpdate', (topic, message) => { deviceUpdater(topic, message) });

class Device{
    constructor(newDevice){
        this.type = newDevice.type;//switch, dimmer, virtual, etc.....
        this.name = newDevice.name;
        this.room = newDevice.room;
        this.description = newDevice.description;
        this.cmndTopic = newDevice.cmndTopic;
        this.statTopic = newDevice.statTopic;
        this.onMessage = newDevice.onMessage;
        this.offMessage = newDevice.offMessage;
        this.priceShutdown = newDevice.priceShutdown; // 0 for none 1-3 for different severity levels 1 Most Severe 3 Least Severe
        this.priceShutdownMode = newDevice.priceShutdownMode;
        this.resumeAfterShutdown = newDevice.resumeAfterShutdown;
        this.preShutdownState = '';
        this.currentState = 'ON';
       
    }
    toggle(){
        if(this.currentState = 'ON'){
            dH.sendMqtt(this.cmndTopic, this.offMessage);
            console.log(this.name +' Toggled Off');
        }
        else{
            dH.sendMqtt(this.cmndTopic, this.onMessage);
            console.log(this.name +' Toggled On');
        }
    }
    turnOff(){
        console.log(this.name +' Turned Off');
        dH.sendMqtt(this.cmndTopic, this.offMessage);
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
    hiPriceShutdown(){
        if(this.priceShutdownMode = 'ON'){
            this.turnOn();
        }
        else if(this.priceShutdownMode = 'OFF'){
            this.turnOff();
        }

    }
}
class Room{
    constructor(newRoom){
    this.name =newRoom.name;
    this.description = '';
    this.widgets = '';
    this.background = '';
    this.devices = findByRoom(this.name);
    
    }
    
}
function findByRoom(room){
    const filteredItems = myDevices.filter(item => item.room.includes(room));
    console.log(room + " Has " + filteredItems.length + " Devices");
    return [...filteredItems];

}
function getRoomDevices(room){
    const filteredItems = myRooms.filter(item => item.name.includes(room));
    return filteredItems[0].devices;
}
//=======================================================================================
//               Price Spike Function Ran When Listener Sees Price Spike
//=======================================================================================
function priceSpikeHandler(p){
    myDevices.forEach((D) => {
        if(0 != D.priceShutdown && D.priceShutdown <= p){
            D.hiPriceShutdown();
        }
    })
}
function deviceUpdater(topic, message){
    const filteredDevices = myDevices.find((device)=> {
        return device.statTopic === topic;
    })
    filteredDevices.currentState = message;
}
//================================================================================
//================================Create Rooms And Devices========================
//================================================================================
async function createDevices(){
    var deviceArray = await dH.getJsonFile('home_json/myDevices.json');
    deviceArray.forEach((item, index) =>{ 
        myDevices[index] = new Device(item);
    });
    console.log(myDevices.length + " Devices Created From myDevices.json");
}
async function createRooms(){
    var roomArray = await dH.getJsonFile('home_json/myRooms.json');
    roomArray.forEach((item, index) =>{ 
        myRooms[index] = new Room(item);
    });
    console.log(myRooms.length + " Rooms Created From myRooms.json");
}
async function setup(){
    try{
        await createDevices();
        await createRooms();
    }
    catch(error){
        console.log(error);
    }
}
var myDevices = [];
var myRooms = [];
setup();
module.exports.myRooms = myRooms
module.exports.myDevices = myDevices
module.exports.getRoomDevices = getRoomDevices