//Importing the seller class model
const Seller = require("../../models/seller");
//Importing the validator class model
const SellerDishes = require("../../models/sellerDishes");

//Importing the filehelper function in order to delete the files form the server
const fileHelper = require("../../util/file");

exports.getSellerConfig = (req, res, next) => {
  const sellerID = req.query.sellerID;
  Seller.findByID(sellerID)
    .then((seller) => {
      if (seller) {
        if (seller.isConfigured == true) {
          res.status(409).json({
            message: "seller configured",
          });
        } else {
          const dishesCount = seller.dishIds.length;
          const specialDishesCount = seller.specialDishesIds.length;
          res.status(200).json({
            message: "returning the seller configurations",
            generalDishesCounts: dishesCount,
            specialDishesCounts: specialDishesCount,
            sellerName: seller.sellerName,
            mobileNo: seller.mobileNo,
          });
        }
      } else {
        res.status(403).json({
          message: "seller id is invalid",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addDishesMenu = (req, res, next) => {
  if (req.files) {
    const sellerID = req.body.sellerID;
    const dishName = req.body.dishName;
    const dishType = req.body.dishType;
    const price = req.body.price;
    const timeReq = req.body.timeReq;
    const isSpecial = req.body.isSpecial;
    const dishImageURL = req.files[0].path;
    let dishID = null;

    if (sellerID && dishName && dishType && price && timeReq && isSpecial) {
      console.log("in the first if");
      Seller.findByID(sellerID)
        .then((seller) => {
          if (seller) {
            const normalDishesCounts = seller.dishIds.length;
            const specialDishesCounts = seller.specialDishesIds.length;

            console.log(
              "printing the normal and special dishes => " +
                normalDishesCounts +
                " " +
                specialDishesCounts
            );
            const sellerDish = new SellerDishes(
              dishName,
              dishType,
              price,
              timeReq,
              dishImageURL,
              isSpecial,
              sellerID
            );

            if (isSpecial == "true" || isSpecial == true) {
              console.log("in the second if");

              if (specialDishesCounts < 3) {
                console.log("in the third if");
                //check if the dish is already exist

                //add the nomal dishes

                return sellerDish
                  .save()
                  .then((result) => {
                    console.log(result);
                    dishID = result.insertedId;
                    Seller.addTheDishIntoSeller(isSpecial, seller, dishID);
                  })
                  .then((result) => {
                    //check if the seller is not configured before and seller
                    if (seller.isConfigured == false && seller.pinCode) {
                      Seller.configureSeller(sellerID)
                        .then((sel) => {
                          console.log("seller Configured");
                        })
                        .catch((err) => console.log(err));
                    }
                    res.status(201).json({
                      message: "Special Dish is added successfully",
                    });
                  })
                  .catch((err) => console.log(err));
              } else {
                //special capacity is full so reject
                fileHelper.deleteFile(dishImageURL);
                res.status(403).json({
                  message: "all special dishes slots are full",
                });
              }
            } else {
              if (normalDishesCounts < 10) {
                //add the normal dishes
                return sellerDish
                  .save()
                  .then((result) => {
                    console.log(result);
                    dishID = result.insertedId;
                    Seller.addTheDishIntoSeller(isSpecial, seller, dishID);
                  })
                  .then((result) => {
                    if (seller.isConfigured == false && seller.pinCode) {
                      Seller.configureSeller(sellerID)
                        .then((sel) => {
                          console.log("seller Configured");
                        })
                        .catch((err) => console.log(err));
                    }
                    res.status(201).json({
                      message: "Normal Dish is added successfully",
                    });
                  })
                  .catch((err) => console.log(err));
              } else {
                //normal dishes capacity is full so reject
                fileHelper.deleteFile(dishImageURL);
                res.status(403).json({
                  message: "all Normal dishes slots are full",
                });
              }
            }
          } else {
            fileHelper.deleteFile(dishImageURL);
            res.status(404).json({
              message: "Seller Id is invalid",
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      fileHelper.deleteFile(dishImageURL);
      res.status(302).json({
        message: "Some of the entries are empty",
      });
    }
  } else {
    res.status(302).json({
      message: "image not recieved",
    });
  }
};

exports.fillSellerDetails = (req, res, next) => {
  if (req.files) {
    const casualImageURL = req.files[0].path;
    const sellerID = req.body.sellerID;
    const areaName = req.body.areaName;
    const pinCode = req.body.pinCode;
    const bio = req.body.bio;
    const facebook = req.body.facebook;
    const instagram = req.body.instagram;

    if (sellerID && areaName && pinCode) {
      let appendString = null;
      let facebookURL = null;
      let instagramURL = null;
      let config = null;
      if (facebook != "" || facebook != " ") {
        appendString = "https://www.facebook.com/";
        facebookURL = appendString + facebook + "/";
      } else {
        facebookURL = "";
      }

      if (instagram != "" || instagram != " ") {
        appendString = "https://www.instagram.com/";
        instagramURL = appendString + instagram + "/";
      } else {
        instagramURL = "";
      }

      //finding the seller
      Seller.findByID(sellerID)
        .then((seller) => {
          //check if the seller exist then proceed
          if (seller) {
            //if updated successfully check if the seller is already configured
            //if seller is not configured then check if it have any dish inserted else ignore
            if (
              (seller.dishIds.length > 0 ||
                seller.specialDishesIds.length > 0) &&
              seller.isConfigured == false
            ) {
              //if dish is inserted then make the isConfigured as true
              config = true;
            } else {
              //else ignore
              config = false;
            }
            console.log("Printing the value of the config ->" + config);
            //updating the corresponding fields of the seller in the model

            Seller.saveSellerPendingInfo(
              sellerID,
              casualImageURL,
              areaName,
              pinCode,
              bio,
              facebookURL,
              instagramURL,
              config
            )
              .then((result) => {
                //send the message that the seller have been updated successfully
                res.status(200).json({
                  message: "information updated!",
                });
              })
              .catch((err) => console.log(err));
          } else {
            //if seller dont exists give status code 403 and responce
            res.status(403).json({
              message: "seller not found",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.status(406).json({
        message: "Some fields are empty",
      });
    }
  } else {
    res.status(422).json({
      message: "image is missing",
    });
  }
};

//under maintanance
exports.getSellerDashbord = (req, res, next) => {
  const sellerID = req.query.sellerID;
  let specicalDishBuffer = [];
  let generalDishBuffer = [];
  Seller.findByID(sellerID)
    .then((seller) => {
      if (seller) {
        SellerDishes.findMultiSellerDishes(seller.specialDishesIds)
          .then((dishes) => {
            dishes.forEach((dish) => {
              specicalDishBuffer.push(dish);
            });
            return SellerDishes.findMultiSellerDishes(seller.dishIds);
          })
          .then((result) => {
            console.log("printing the normal dishes");
            console.log(result);
            result.forEach(dish => {
              generalDishBuffer.push(dish);              
            });
          })
          .then((result) => {
            // console.log(specicalDishBuffer);
            return res.status(200).json({
              data: {
                img: seller.casualImage,
                name: seller.sellerName,
                areaName: seller.areaName,
                pinCode: seller.pinCode,
                mobileNo: seller.mobileNo,
                email: seller.email,
                facebook: seller.socialMedia.facebookURL,
                instagram: seller.socialMedia.instagramURL,
                bio: seller.bio,
                specialDishes: specicalDishBuffer,
                generalDishes: generalDishBuffer,
              },
            });
          })
          .catch((err) => console.log(err));

        // SellerDishes.findMultiSellerDishes(false, seller.dishID).then(dishes => {
        //   specialDishes = dishes;
        // }).catch(err => console.log(err));
      } else {
        return res.status(403).json({
          message: "Seller not Found!",
        });
      }
    })
    .catch((err) => console.log(err));
};
