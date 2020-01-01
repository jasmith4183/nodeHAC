const dH = require('./dataHandler');
const schedule = require('node-schedule');
const env = require('dotenv').config({path: __dirname + '/.env'})
const myEmitter = require('./myEmitter');


const weatherURL = 'https://api.darksky.net/forecast/' + process.env.API_TOKEN + '/31.427431,-100.491683';
const weatherOptions = '?exclude=[minutely,hourly,daily,flags,alerts]';

var currentWeather = {'test': 'data'};


async function weatherMainLoop(){
    try{
        var axData = await dH.getHTTP(weatherURL + weatherOptions);
        let resData = axData.data;
        currentWeather = {...resData.currently};
        //console.log(currentWeather);
        myEmitter.emit('newWeather', currentWeather);
        dH.dbInsert('weatherData', resData);
    } 
    catch(err){
        console.error(err);
    }
}
weatherMainLoop();

var weatherRule = new schedule.RecurrenceRule();
//weatherRule.minute = [new schedule.Range(0, 59)];
weatherRule.minute = [0, 15, 30, 45];
var weatherSchedule = schedule.scheduleJob(weatherRule, () =>{weatherMainLoop();});
//console.log(currentWeather);
module.exports.current = currentWeather