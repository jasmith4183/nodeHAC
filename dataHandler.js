var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

  //var MongoClient = require('mongodb').MongoClient;

function mongoInsert(mongoURL, mongoDB, monogoCollection, mongoData){
    MongoClient.connect(mongoURL, function(err, db) {
     if (err) throw err;
         var dbo = db.db(mongoDB);
         dbo.collection(monogoCollection).insertOne(mongoData, function(err, res) {
    if (err) throw err;
     console.log("1 document inserted");
    db.close();
  });
});
}
module.exports.mongoInsert = mongoInsert;
