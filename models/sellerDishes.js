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
    return db
      .collection("sellerDishes")
      .insertOne(this);
  }

  //under developement 
  //static function to check if the dish is existing already

  static findDishByName(isSpecial, dishName){
    const db = getDb();
    if(isSpecial){
      db.collection('sellerDishes').findOne({})
    }
  }


}

module.exports = SellerDishes;
