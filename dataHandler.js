var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongoDB = 'mydb'
const device = require('./device')

const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')

//=======================================================================================
//                                 MQTT Listener Setup
//=======================================================================================

client.on('connect', () => {
    client.subscribe('home/#')
})

client.on('message', (topic, message) => {
    // console.log(topic + ' ' + message);
    if(device.myDevices.includes(topic)){
        const D = device.myDevices.find((device) =>{
            return device.statTopic === topic;
        })
        console.log(messgage + ': MQTT Message Recieved for ' + D.name + 'in ' + D.room);
        D.updateState(message);
    }
})
 
//=======================================================================================
//                                Mongo Insert Document Function
//=======================================================================================
function dbInsert(mongoCollection, mongoData){
    MongoClient.connect(url,  { useUnifiedTopology: true }, function(err, db) {
     if (err) throw err;
         var dbo = db.db(mongoDB);
         dbo.collection(mongoCollection).insertOne(mongoData, function(err, res) {
    if (err) throw err;
     console.log(mongoData.date +":  Document Insert Into " + mongoCollection + " Was A Success");
    db.close();
  });
});
}
//=======================================================================================
//                                 MQTT Send Message
//=======================================================================================
function sendMqttMessage(topic, message){
    client.publish(topic, message);
}
module.exports.dbInsert = dbInsert;
module.exports.sendMqtt = sendMqttMessage;

