const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Seller {
    constructor(sellerName, mobileNo, password, panImage, personalImage){
        this.sellerName = sellerName;
        this.mobileNo = mobileNo;
        this.password = password;
        this.panImage = panImage;
        this.personalImage = personalImage;
        this.email = null;
        this.casualImage = null;
        this.areaName = null;
        this.pinCode = null;
        this.bio = null;
        this.socialMedia = {};
        this.dishIds = [];
        this.specialDishesName = [];
        this.orderIds = [];
        this.avgRating = 3;
        this.isValidated = false;
        this.isConfigured = false;
    }
    //this function is saving the user into the database
    //so far the edit functionality is not covered

    save(){
        console.log("adding the seller into the database");
        const db = getDb();
        return db.collection("seller").insertOne(this);
    }

    static findByMobileNo(searchingMobileNo) {
        const db = getDb();
        return db
          .collection("seller")
          .findOne({ mobileNo : searchingMobileNo })
          .then((seller) => {
            console.log(seller);
            return seller;
          })
          .catch((err) => {
            console.log(err);
          });
      }
}

module.exports = Seller;