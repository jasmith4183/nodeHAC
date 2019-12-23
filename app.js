'use strict';
const power = require('./power')
const pool = require('./pool')
const scheduler = require('./scheduler')
const Device = require('./device')


var pool1 = new Device('pool', 'pumpOff');
pool1.turnOff();
pool1.turnOn();

var devices = [new Device('pool', 'pumpOff'), new Device('pool', 'pumpLo'), new Device('pool', 'pumpMed'), new Device('pool', 'pumpHi')];
devices[1].statTopic = 'c';
devices[2].statTopic = 'a';
devices[3].statTopic = 'b';
const foundDevice = devices.find((device) =>{
    return device.statTopic === 'b';
})
console.log(foundDevice);