//importing the database and its functions
const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class SellerDishes {
  constructor(name, type, price, timeReq, imageURL, isSpecial, sellerId) {
    this.name = name;
    this.type = type;
    this.price = price;
    this.timeReq = timeReq;
    this.imageURL = imageURL;
    this.isSpecial = isSpecial;
    this.sellerId = new mongodb.ObjectId(sellerId);
  }

  save() {
    const db = getDb();
    return db.collection("sellerDishes").insertOne(this);
  }

  //under developement
  //static function to check if the dish is existing already

  static findDishByName(isSpecial, dishName) {
    const db = getDb();
    if (isSpecial) {
      db.collection("sellerDishes").findOne({});
    }
  }

  static findMultiSellerDishes(dishIDs) {
    const db = getDb();
    return db
      .collection("sellerDishes")
      .find({ _id: { $in: [...dishIDs] } })
      .toArray();
  }
  static findDishByID(dishID) {
    const db = getDb();
    return db
      .collection("sellerDishes")
      .findOne({ _id: new mongodb.ObjectId(dishID) });
  }

  static updateDish(dishID, name, type, price, timeReq, imageURL) {
    const db = getDb();
    return db.collection("sellerDishes").updateOne(
      { _id: new mongodb.ObjectId(dishID) },
      {
        $set: {
          name: name,
          type: type,
          price: price,
          timeReq: timeReq,
          imageURL: imageURL,
        },
      }
    );
  }
  static deleteDish(dishID) {
    const db = getDb();
    console.log("dish id is => " + dishID);
    return db
      .collection("sellerDishes")
      .deleteOne({ _id: new mongodb.ObjectId(dishID) });
  }
}

module.exports = SellerDishes;
