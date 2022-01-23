const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Validator {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.sellerIds = [];
  }
  save() {
    const db = getDb();
    return db.collection("validator").insertOne(this);
  }

  static addSellerToValidationQueue(validator , SellerId){
    const db = getDb();
    const oldSellerIDs = validator.sellerIds;
    oldSellerIDs.push(SellerId);
    console.log("in DB " + oldSellerIDs);
    
    return db.collection("validator").updateOne({_id : new mongodb.ObjectId(validator._id)}, {$set : {sellerIds : oldSellerIDs}});
  }

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
module.exports = Validator;
