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
  static addSellerToValidationQueue(validator, SellerId) {
    const db = getDb();
    const oldSellerIDs = validator.sellerIds;
    oldSellerIDs.push(SellerId);

    return db.collection("validator").updateOne(
      { _id: new mongodb.ObjectId(validator._id) },
      { $set: { sellerIds: oldSellerIDs } }
      // { $set: { sellerIds: [] } }
    );
  }

  //static function for finding the validator by the username
  static findByUsername(username) {
    const db = getDb();
    return db
      .collection("validator")
      .findOne({ username: username })
      .then((vali) => {
        return vali;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //static method for deleting the varified or rejected user id from the sellerIDs of validator
  static deleteSellerID(validatorSellerIDs, sellerID) {
    const tempArr = [];
    validatorSellerIDs.forEach(sellerid => {
      tempArr.push(sellerid.toString());
    });
    const sellerIndex = tempArr.indexOf(sellerID);
    console.log(sellerIndex);
    validatorSellerIDs.splice(sellerIndex, 1);
    const db = getDb();
    return db
      .collection("validator")
      .updateOne(
        { _id: new mongodb.ObjectId("61ece3aa24f20544afb6c4ea") },
        { $set: { sellerIds: validatorSellerIDs } }
      );
  }
}

//exporting the validator class
module.exports = Validator;
