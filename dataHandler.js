var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongoDB
  
function dbInsert(monogoCollection, mongoData){
    MongoClient.connect(url,  { useUnifiedTopology: true }, function(err, db) {
     if (err) throw err;
         var dbo = db.db(mongoDB);
         dbo.collection(monogoCollection).insertOne(mongoData, function(err, res) {
    if (err) throw err;
     console.log(mongoData.date +":  Document Insert Success");
    db.close();
  });
});
}
module.exports.dbInsert = dbInsert;
