//importing the mongodb
const mongodb = require("mongodb");
//importing the database handler function
const getDb = require("../util/database").getDb;

//creating the class as abstract structure to store the data for the consumers
class Consumer {
  constructor(name, mobileNo, address, password) {
    this.name = name;
    this.mobileNo = mobileNo;
    this.address = address;
    this.password = password;
    //initially customer orders are kept empty arrays
    this.customerOrderIds = [];
    //initially customer image is kept as null
    this.customerImage = null;
  }

  // this is the function for saving the user into the database,
  //so far edit functionality is not there so only adding new users in to database.
  save() {
    const db = getDb();
    return db.collection("consumer").insertOne(this);
  }

  //static function to find the consumer into the database using the mobile number
  static findByMobileNo(searchingMobileNo) {
    const db = getDb();
    return db
      .collection("consumer")
      .findOne({ mobileNo: searchingMobileNo })
      .then((consumer) => {
        return consumer;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //static function to find the consumer with the _id
  static findById(consumerID) {
    const db = getDb();
    return db
      .collection("consumer")
      .findOne({ _id: new mongodb.ObjectId(consumerID) })
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }
}

//exporting the consumer class
module.exports = Consumer;
