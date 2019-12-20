var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var mongoDB = 'mydb'
  
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
module.exports.dbInsert = dbInsert;
