const express = require('express');
const app = express()
const schedule = require('node-schedule');
// var weather = require('./weather');
var server = require('http').Server(app);
var io = require('socket.io')(server);
const myEmitter = require('./myEmitter');
app.use(express.static('public'));

server.listen(80);
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.emit('news', "hello world" );
    socket.on('clientInfo', (data) => {
        console.log(data);
    });
    socket.on('setPump', (data) => {
        console.log(data);
    });


  
});
function uiMainLoop(topic, weather){   io.emit(topic, weather);   }

myEmitter.on('newWeather', (data) => { uiMainLoop('newWeather', data) });
myEmitter.on('newPrice', (data) => { uiMainLoop('newPrice', data) });

// var uiRule = new schedule.RecurrenceRule();
// uiRule.minute = [15, 17, 18, 19, 20, 21, 22, 23, 24, 45, 55];
// var griddySchedule = schedule.scheduleJob(uiRule, () =>{uiMainLoop();});