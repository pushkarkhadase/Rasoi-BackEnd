const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Validator {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.sellerIds = [];
  }
  save(){
      const db = getDb();
      return db.collection('validator').insertOne(this);
  }
}

module.exports = Validator;