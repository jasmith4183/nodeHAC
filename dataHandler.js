var mongo = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongoDB = 'mydb'
const device = require('./device')
const getDB = require('./mongoutil').getDb;
const MC = require('./mongoutil').connectToServer;

MC (function( err, client ) {
    if (err) console.log(err);
     // start the rest of your app here
} );

const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://localhost:1883')
//=======================================================================================
//                                 Axios Post Request
//=======================================================================================
//=======================================================================================
//                                 
//=======================================================================================

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
//This function is operational and has no known bugs
function dbInsert(mongoCollection, mongoData){
    mongo.connect(url, {useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) throw err;
        const db = client.db(mongoDB);
        const collection = db.collection(mongoCollection);
        collection.insertOne(mongoData, function(err, res) {
            if (err) throw err;
            console.log(mongoData.date +":  Document Insert Into " + mongoCollection + " Was A Success");
            client.close();
        });
    });
}

mongo.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) throw err;
    const db = client.db(mongoDB);});
//=======================================================================================
//                                 Get mongo data using find
//=======================================================================================
//I can not seem to get this function to work properly async so that my code properl;y waits on getting its data
// async function getCollection(mongoCollection, a ={}){
//      db = new mongo().getDB(mongoDB); 
//         const collection = db.collection(mongoCollection);

//         let response = await collection.find(a).toArray();
//         return response;
//     }

    async function getDoc(Col, a = {}) {
        var results = [];
        return new Promise(
            (resolve, reject) => {
                mongo.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
                  if (err) {
                    console.error(err);
                    return
                  }

                const db = client.db('mydb');
                const collection = db.collection(Col);

                var items =collection.find(a).toArray();
                console.log (items);
                results = items;
                  //...
                })
    
            resolve(results);
            })
    }
console.log(getDoc('poolData', {'speed': 2}));
//=======================================================================================
//                                 MQTT Send Message
//=======================================================================================
function sendMqttMessage(topic, message){
    client.publish(topic, message);
}
module.exports.dbInsert = dbInsert
module.exports.sendMqtt = sendMqttMessage

