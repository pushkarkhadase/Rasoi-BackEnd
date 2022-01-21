const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Consumer {
  constructor(name, mobileNo, address, password) {
    this.name = name;
    this.mobileNo = mobileNo;
    this.address = address;
    this.password = password;
    this.customerOrderIds = [];
    this.customerImage = null;
  }
  // this is the function for saving the user into the database,
  //so far edit functionality is not there so only adding new users in to database.
  save() {
    const db = getDb();
    return db.collection("consumer").insertOne(this);
  }

  static findByMobileNo(searchingMobileNo) {
    const db = getDb();
    return db
      .collection("consumer")
      .findOne({ mobileNo : searchingMobileNo })
      .then((consumer) => {
        console.log(consumer);
        return consumer;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Consumer;
