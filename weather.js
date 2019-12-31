const dH = require('./dataHandler');
const schedule = require('node-schedule');
require('dotenv').config({path: __dirname + '/.env'})
const weatherURL = 'https://api.darksky.net/forecast/' + process.env.API_TOKEN + '/31.427431,-100.491683';
const weatherOptions = '?exclude=[minutely,hourly,daily,flags,alerts]';

async function weatherMainLoop(){
    try{
        var axData = await dH.getHTTP(weatherURL + weatherOptions);
        let resData = axData.data;
        dH.dbInsert('weatherData', resData);
    } 
    catch(err){
        console.error(err);
    }
}
weatherMainLoop();
var weatherRule = new schedule.RecurrenceRule();
weatherRule.minute = [0, 15, 30, 45];
var weatherSchedule = schedule.scheduleJob(weatherRule, () =>{weatherMainLoop();});
