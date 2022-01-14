const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = callback => {
    MongoClient.connect(
         "mongodb+srv://pushkar:Bhaiya22@cluster0.zz6sb.mongodb.net/Rasoi?retryWrites=true&w=majority"
      )
        .then(client => {
            console.log("Connection Established!!!");
            _db = client.db();
            callback();
            
        })
        .catch(err=>{
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        console.log("database found")
        return _db;
    }
    throw "Sorry no database found!!";
}

  
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

