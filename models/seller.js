//importing the database and its functions
const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

//creating the class as abstract data type for storing the information of seller into the database
class Seller {
  constructor(sellerName, mobileNo, password, panImage, personalImage) {
    this.sellerName = sellerName;
    this.mobileNo = mobileNo;
    this.password = password;
    //image link will be stored
    this.panImage = panImage;
    //image link will be stored
    this.personalImage = personalImage;
    //all the below fields are kept empty as all will be set as per need
    this.casualImage = null;
    this.areaName = null;
    this.pinCode = null;
    this.bio = null;
    this.socialMedia = {};
    this.dishIds = [];
    this.specialDishesIds = [];
    this.avgRating = 3;
    //since new seller is yet to be valified we have kept it as false
    this.isValidated = false;
    //since new seller have not added any of his menu we have kept it as false
    this.isConfigured = false;
    //special dish name
    this.specialDishesNames = [];
    this.orders = [];
    this.avgRatingNumerator = 3;
    this.avgRatingDinominator = 1;
  }

  //this function is saving the seller into the database
  //so far the edit functionality is not covered
  save() {
    const db = getDb();
    return db.collection("seller").insertOne(this);
  }

  //static function to find the seller using his mobile number
  static findByMobileNo(searchingMobileNo) {
    const db = getDb();
    return db
      .collection("seller")
      .findOne({ mobileNo: searchingMobileNo })
      .then((seller) => {
        return seller;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findByID(sellerID) {
    const db = getDb();
    return db
      .collection("seller")
      .findOne({ _id: new mongodb.ObjectId(sellerID) })
      .then((seller) => {
        return seller;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static addTheDishIntoSeller(isSpecial, seller, dishID, specialDishNames) {
    const db = getDb();
    const dishes =
      isSpecial == "true" ? seller.specialDishesIds : seller.dishIds;
    dishes.push(new mongodb.ObjectId(dishID));
    if (isSpecial == "true" || isSpecial == true) {
      return db
        .collection("seller")
        .updateOne(
          { _id: new mongodb.ObjectId(seller._id) },
          {
            $set: {
              specialDishesIds: dishes,
              specialDishesNames: specialDishNames,
            },
          }
        )
        .then((res) => {})
        .catch((err) => console.log(err));
    } else {
      return db
        .collection("seller")
        .updateOne(
          { _id: new mongodb.ObjectId(seller._id) },
          { $set: { dishIds: dishes } }
        )
        .then((res) => {})
        .catch((err) => console.log(err));
    }
  }

  static configureSeller(sellerID) {
    const db = getDb();
    return db
      .collection("seller")
      .updateOne(
        { _id: new mongodb.ObjectId(sellerID) },
        { $set: { isConfigured: true } }
      );
  }

  static saveSellerPendingInfo(
    sellerID,
    casualImageURL,
    areaName,
    pinCode,
    bio,
    facebookURL,
    instagramURL,
    config
  ) {
    const socialMedia = {
      facebookURL: facebookURL,
      instagramURL: instagramURL,
    };
    const db = getDb();
    return db.collection("seller").updateOne(
      { _id: new mongodb.ObjectId(sellerID) },
      {
        $set: {
          casualImage: casualImageURL,
          areaName: areaName,
          pinCode: pinCode,
          bio: bio,
          socialMedia: socialMedia,
          isConfigured: config,
        },
      }
    );
  }
  //static function for finding all the sellers with ids
  static findMuliSellerByIds(sellerIDs) {
    const db = getDb();

    return db
      .collection("seller")
      .find({ _id: { $in: [...sellerIDs] } })
      .toArray();
  }

  //static method for validating the seller
  static validateSeller(sellerID) {
    const db = getDb();
    return db
      .collection("seller")
      .updateOne(
        { _id: new mongodb.ObjectId(sellerID) },
        { $set: { isValidated: true } }
      );
  }

  //static method for deleting the rejected seller
  static deleteRejectedSeller(sellerID) {
    const db = getDb();
    return db
      .collection("seller")
      .deleteOne({ _id: new mongodb.ObjectId(sellerID) });
  }

  //static method for returning all the sellers into the database
  static getAllSellers() {
    const db = getDb();
    return db.collection("seller").find({}).toArray();
  }

  //static method for returning all the sellers form the database in the sorted order
  static getAllSellersInSortedOrder(order) {
    const db = getDb();
    return db
      .collection("seller")
      .find({})
      .sort({ avgRating: order })
      .toArray();
  }

  //static method for search seller and dishes
  static searchSellerAndDishes(searchingString) {
    const db = getDb();
    // db.collection("seller").createIndex({sellerName: "text", specialDishesNames: "text"});
    db.collection("seller").createIndex({
      sellerName: 1,
      specialDishesNames: 1,
    });
    // return db.collection("seller").find({$text: { $search : {$regex : "p"}}}).toArray();
    return db
      .collection("seller")
      .find({
        $or: [
          { sellerName: { $regex: searchingString } },
          { specialDishesNames: { $regex: searchingString } },
        ],
      })
      .toArray();
  }

  //static method for updating the seller information
  static updateSellerInfo(
    sellerID,
    casualImage,
    pinCode,
    areaName,
    bio,
    socialMedia
  ) {
    const db = getDb();
    return db.collection("seller").updateOne(
      { _id: new mongodb.ObjectId(sellerID) },
      {
        $set: {
          casualImage: casualImage,
          pinCode: pinCode,
          areaName: areaName,
          bio: bio,
          socialMedia: socialMedia,
        },
      }
    );
  }

  static updateDeletedSellerDishRecord(sellerID, dishids, dishName, isSpecial) {
    const db = getDb();
    if (isSpecial == "false" || isSpecial == false) {
      return db
        .collection("seller")
        .updateOne(
          { _id: new mongodb.ObjectId(sellerID) },
          { $set: { dishIds: dishids } }
        );
    } else {
      return db
        .collection("seller")
        .updateOne(
          { _id: new mongodb.ObjectId(sellerID) },
          { $set: { specialDishesIds: dishids, specialDishesNames: dishName } }
        );
    }
  }
  static updateSpecialDishNameArray(sellerID, updatedNames) {
    const db = getDb();
    return db
      .collection("seller")
      .updateOne(
        { _id: new mongodb.ObjectId(sellerID) },
        { $set: { specialDishesNames: updatedNames } }
      );
  }
  static updateOrderQueue(sellerID, newOrders) {
    const db = getDb();
    return db
      .collection("seller")
      .updateOne(
        { _id: new mongodb.ObjectId(sellerID) },
        { $set: { orders: newOrders } }
      );
  }

  static deleteOrderID(sellerId, orderIds) {
    const db = getDb();
    return db
      .collection("seller")
      .updateOne(
        { _id: new mongodb.ObjectId(sellerId) },
        { $set: { orders: orderIds } }
      );
  }

  static updateRatingsParameters(sellerId, numerator, dinominator , avgRating) {
    const db = getDb();
    return db
      .collection("seller")
      .updateOne(
        { _id: new mongodb.ObjectId(sellerId) },
        {
          $set: {
            avgRatingNumerator: numerator,
            avgRatingDinominator: dinominator,
            avgRating:avgRating
          },
        }
      );
  }
}

//exportting the seller
module.exports = Seller;
