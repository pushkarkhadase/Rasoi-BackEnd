//importing the database and its functions
const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

//creating the class as abstract data type for storing the information of seller into the database
class Seller {
    constructor(sellerName, mobileNo, password, panImage, personalImage){
        this.sellerName = sellerName;
        this.mobileNo = mobileNo;
        this.password = password;
        //image link will be stored
        this.panImage = panImage;
        //image link will be stored
        this.personalImage = personalImage;
        //all the below fields are kept empty as all will be set as per need
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
        //since new seller is yet to be valified we have kept it as false
        this.isValidated = false;
        //since new seller have not added any of his menu we have kept it as false
        this.isConfigured = false;
    }

    //this function is saving the seller into the database
    //so far the edit functionality is not covered
    save(){
        const db = getDb();
        return db.collection("seller").insertOne(this);
    }

    //static function to find the seller using his mobile number
    static findByMobileNo(searchingMobileNo) {
        const db = getDb();
        return db
          .collection("seller")
          .findOne({ mobileNo : searchingMobileNo })
          .then((seller) => {
            return seller;
          })
          .catch((err) => {
            console.log(err);
          });
      }
}

//exportting the seller
module.exports = Seller;