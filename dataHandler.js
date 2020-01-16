const mongo = require('mongodb').MongoClient;
const axios = require('axios');
const myEmitter = require('./myEmitter');
const mqtt = require('mqtt');
const fs = require('fs');

const mongoURL = "mongodb://localhost:27017/";
const mongoDB = 'mydb';
const mongoOptions = {useNewUrlParser: true, useUnifiedTopology: true};

// const device = require('./device');

const client = mqtt.connect('mqtt://localhost:1883');
//=======================================================================================
//                                 Axios Post Request
//=======================================================================================
async function postHTTP(url, payload){return axios.post(url, payload );}
//=======================================================================================
//                                 
//=======================================================================================
async function getHTTP(url, options){return axios.get(url, options);}
//=======================================================================================
//                                 MQTT Listener Setup
//=======================================================================================
client.on('connect', () => {client.subscribe('#')});

client.on('message', (topic, message) => {
    if(topic.includes("tele") || topic.includes("RESULT")){    }
    else if(topic.includes("home") && topic.includes("stat") && message.includes("OFF")){   myEmitter.emit(topic, "OFF");   }
    else if(topic.includes("home") && topic.includes("stat") && message.includes("ON")){    myEmitter.emit(topic, "ON");    }
    else if(topic.includes("blueiris")){   console.log(topic + ' ' + message);    }
})
//=======================================================================================
//                                Mongo Insert Document Function
//=======================================================================================
function dbInsert(mongoCollection, mongoData){
    mongo.connect(mongoURL, mongoOptions, (err, client) => {
        if (err) throw err;
        const db = client.db(mongoDB);
        const collection = db.collection(mongoCollection);
        collection.insertOne(mongoData, function(err, res) {
            if (err) throw err;
            console.log(":  Document Insert Into " + mongoCollection + " Was A Success");
            client.close();
        });
    });
}
// mongo.connect(mongoURL, mongoOptions, (err, client) => {
//     if (err) throw err;
//     const db = client.db(mongoDB);});
//=======================================================================================
//                                 Get mongo data using find
//=======================================================================================
//I can not seem to get this function to work properly async so that my code properl;y waits on getting its data
async function getDoc(Col, a = {}) {
    var results = [];
    return new Promise((resolve, reject) => {
        mongo.connect(mongoURL, mongoOptions, (err, client) => {
            if (err) {
                console.error(err);
                return
            }

        const db = client.db('mydb');
        const collection = db.collection(Col);
        var items =collection.find(a).toArray();
        // console.log (items);
        results = items;
        //...
        })
    
            resolve(results);
            })
    }
//=======================================================================================
//                                 MQTT Send Message
//=======================================================================================
function sendMqttMessage(topic, message){
    client.publish(topic, message);
}
//=======================================================================================
//                                 Get JSON File
//=======================================================================================
async function getJsonFile(fileName){
    var jsonData = await fs.readFileSync(fileName, 'utf8');
    jsonData = await JSON.parse(jsonData);
    return  jsonData;
}
module.exports.getJsonFile = getJsonFile
module.exports.dbInsert = dbInsert
module.exports.sendMqtt = sendMqttMessage
module.exports.postHTTP = postHTTP
module.exports.getHTTP = getHTTP


