const express = require('express');
const app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);
const myEmitter = require('../myEmitter');
app.use(express.static('public'));
const devices = require('../home_modules/device');

server.listen(80);
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/rooms', function (req, res) {
    res.sendFile(__dirname + '/rooms.html');
  })

io.on('connection', (socket) => {
    socket.emit('newWeather', latestWeatherData );
    socket.emit('newPrice', latestPowerData );
    socket.emit('newDevices', devices.getRoomDevices('pool'));
    socket.on('setPump', (data) => {
        console.log(data);
        myEmitter.emit('deviceControlRequested', data);
    }); 
});
function uiMainLoop(topic, weather){   io.emit(topic, weather);   }
var latestWeatherData = {};
var latestPowerData = "";
myEmitter.on('newWeather', (data) => { 
    latestWeatherData ={...data};
    uiMainLoop('newWeather', data) 
});
myEmitter.on('newPrice', (data) => { 
    latestPowerData = data;
    uiMainLoop('newPrice', data) });