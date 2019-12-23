var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongoDB = 'mydb'
const device = require('./device')

const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')

client.on('connect', () => {
    client.subscribe('home/pool/pump/stat/POWER1')
    client.subscribe('home/pool/pump/stat/POWER2')
    client.subscribe('home/pool/pump/stat/POWER3')
    client.subscribe('home/pool/pump/stat/POWER4')
})

client.on('message', (topic, message) => {
    const foundDevice = device.myDevices.find((device) =>{
        return device.statTopic === topic;
    })
    foundDevice.updateState(message);
})
  
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

function sendMqtt(topic, message){
    client.publish(topic, message);
}
module.exports.dbInsert = dbInsert;
module.exports.sendMqtt = sendMqtt


