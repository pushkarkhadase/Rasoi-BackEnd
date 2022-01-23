//importing the mongodb database handler and its functions
const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

//creating the class for the validator
class Validator {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    //initially no seller ids so empty array
    this.sellerIds = [];
  }

  // function to save the validator into the database
  save() {
    const db = getDb();
    return db.collection("validator").insertOne(this);
  }

  //static function to add the newly created seller into the validator's queue for validating him
  static addSellerToValidationQueue(validator , SellerId){
    const db = getDb();
    const oldSellerIDs = validator.sellerIds;
    oldSellerIDs.push(SellerId);
    console.log("in DB " + oldSellerIDs);
    
    return db.collection("validator").updateOne({_id : new mongodb.ObjectId(validator._id)}, {$set : {sellerIds : oldSellerIDs}});
  }

  //static function for finding the validator by the username
  static findByUsername(username) {
    const db = getDb();
    return db
      .collection("validator")
      .findOne({ username: username })
      .then(vali => {
        console.log("validator found");
        console.log(vali);
        return vali;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

//exporting the validator class
module.exports = Validator;
