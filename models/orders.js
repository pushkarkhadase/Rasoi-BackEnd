//importing the mongodb
const mongodb = require("mongodb");
//importing the database handler function
const getDb = require("../util/database").getDb;
//pending->prepairing->delivered
class Orders {
  constructor(
    dishes,
    consumerPhoneNo,
    consumerId,
    consumerName,
    sellerId,
    sellerName,
    dateTime,
    totalCost
  ) {
    this.dishes = dishes;
    this.consumerPhoneNo = consumerPhoneNo;
    this.consumerName = consumerName;
    this.orderStatus = "pending";
    this.sellerId = sellerId;
    this.sellerName = sellerName;
    this.dateTime = dateTime;
    this.totalCost = totalCost;
    this.consumerId = consumerId;
    this.isRated = false;
  }
  save() {
    const db = getDb();
    return db.collection("orders").insertOne(this);
  }

  static findIncompleteOrders(orderIDs) {
    const db = getDb();
    return db
      .collection("orders")
      .find({ _id: { $in: [...orderIDs] } })
      .toArray();
  }
}

module.exports = Orders;
