'use strict';
const power = require('./power')
const pool = require('./pool')
const https = require('https')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

   // console.log("Sending MQTT Data");
   // console.log(power.price);

// var intervalid = setInterval(test, 30000);





//var MongoClient = require('mongodb').MongoClient;

function mongoInsert(mongoURL, mongoDB, monogoCollection, mongoData){
    MongoClient.connect(mongoURL, function(err, db) {
     if (err) throw err;
         var dbo = db.db(nongoDB);
         dbo.collection(monogoCollection).insertOne(mongoData, function(err, res) {
    if (err) throw err;
     console.log("1 document inserted");
    db.close();
  });
});
}
