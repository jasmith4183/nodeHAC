const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb://localhost:27017/";
var mongoDB = 'mydb'
var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true, useUnifiedTopology: true }, function( err, client ) {
      _db  = client.db(mongoDB);
      return callback( err );
    } );
  },

 getDb: function() {
   return _db;
 }
};