//importing the mongodb
const mongodb = require("mongodb");

//Importing the seller class model
const Seller = require("../../models/seller");
//Importing the validator class model
const SellerDishes = require("../../models/sellerDishes");

//Importing the filehelper function in order to delete the files form the server
const fileHelper = require("../../util/file");

//Importing the String Formating function
const stringFormater = require("../../util/stringFormater");

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
    const dishNameTemp = req.body.dishName;
    const dishName = stringFormater.stringFormating(dishNameTemp);
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

                const updatedSpecialDishesNames = seller.specialDishesNames;
                updatedSpecialDishesNames.push(dishName);

                return sellerDish
                  .save()
                  .then((result) => {
                    console.log(result);
                    dishID = result.insertedId;
                    Seller.addTheDishIntoSeller(
                      isSpecial,
                      seller,
                      dishID,
                      updatedSpecialDishesNames
                    );
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
                    Seller.addTheDishIntoSeller(
                      isSpecial,
                      seller,
                      dishID,
                      null
                    );
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
            result.forEach((dish) => {
              generalDishBuffer.push(dish);
            });
          })
          .then((result) => {
            // console.log(specicalDishBuffer);
            /*the following is the object i need to return at consumer for seller profile for consumer
{
  sellerInfo:{
    _id:
    name:
    specialDishesNames:[a , b , c]
    imgUrl:
    address:
    pin:
    social:{
      facebook:
      instagram:
    }
    rating:
    mobileNo:
    email:
  }

  specialDishes:[{
    _id:
    name:
    img:
    price:
    type:
    time:
  }]

  generalDishes:[{
    _id:
    name:
    img:
    price:
    type:
    time:
  }]

}


*/
            return res.status(200).json({
              sellerInfo: {
                id: seller._id,
                img: seller.casualImage,
                name: seller.sellerName,
                areaName: seller.areaName,
                pinCode: seller.pinCode,
                mobileNo: seller.mobileNo,
                email: seller.email,
                facebook: seller.socialMedia.facebookURL,
                instagram: seller.socialMedia.instagramURL,
                bio: seller.bio,
                rating: seller.avgRating
              },
              specialDishes: {
                specialDishes: specicalDishBuffer,
                specialDishesNames: seller.specialDishesNames              },
              generalDishes: {
                generalDishes: generalDishBuffer,
              }
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

exports.editSellerInfo = async (req, res, next) => {
  const sellerID = req.body.sellerID;
  const seller = await Seller.findByID(sellerID);
  let sellerNewImage = req.files.length > 0 ? req.files[0].path : null;
  let pinCode = req.body.pinCode;
  let address = req.body.areaName;
  let bio = req.body.bio;
  let facebook = req.body.facebook;
  let instagram = req.body.instagram;

  if (seller) {
    if (sellerNewImage == null || sellerNewImage == "null") {
      sellerNewImage = seller.casualImage;
    } else {
      fileHelper.deleteFile(seller.casualImage);
    }
    if (pinCode == null || pinCode == "null") {
      pinCode = seller.pinCode;
    }
    if (address == null || address == "null") {
      address = seller.areaName;
    }
    if (bio == null || bio == "null") {
      bio = seller.bio;
    }
    if (facebook == null || facebook == "null") {
      facebook = seller.socialMedia.facebookURL;
    }
    if (instagram == null || instagram == "null") {
      instagram = seller.socialMedia.instagramURL;
    }
    const socialMedia = {
      facebookURL: facebook,
      instagramURL: instagram,
    };
    const result = await Seller.updateSellerInfo(
      sellerID,
      sellerNewImage,
      pinCode,
      address,
      bio,
      socialMedia
    );
    if (result) {
      res.status(200).json({
        message: "seller updated!",
      });
    }
  } else {
    res.status(403).json({
      message: "invalid seller",
    });
  }
};
//under maintanance
exports.editSellerDish = async (req, res, next) => {
  const dishID = req.body.dishID;
  const sellerID = req.body.sellerID;
  let name = req.body.name;
  let type = req.body.type;
  let price = req.body.price;
  let time = req.body.time;

  let newImage = req.files.length > 0 ? req.files[0].path : null;
  const seller = await Seller.findByID(sellerID);
  const dish = await SellerDishes.findDishByID(dishID);

  if (dish && seller) {
    console.log(dish);
    if (name == null || name == "null") {
      console.log(name);
      name = dish.name;
      console.log(dish.name);
      console.log(name);
    }
    if (type == null || type == "null") {
      type = dish.type;
    }
    if (price == null || price == "null") {
      price = dish.price;
    }
    if (time == null || time == "null") {
      time = dish.timeReq;
    }
    if (newImage == null || newImage == "null") {
      newImage = dish.imageURL;
    } else {
      fileHelper.deleteFile(dish.imageURL);
    }
    if(dish.isSpecial == "true" || dish.isSpecial == true){
      let sdnArray = seller.specialDishesNames;
      let dishIndex = sdnArray.indexOf(dish.name);
      sdnArray.splice(dishIndex,1,name);
      const sellerUpdate = await Seller.updateSpecialDishNameArray(sellerID,sdnArray);
    }
    const result = await SellerDishes.updateDish(
      dishID,
      name,
      type,
      price,
      time,
      newImage
    );
    if (result) {
      res.status(200).json({
        message: "Dish updated successfully!",
      });
    }
  } else {
    res.status(403).json({
      message: "invalid dish ID or seller ID",
    });
  }
};
//under developement
exports.deleteSellerDish = async (req, res, next) => {
  const sellerID = req.query.sellerID;
  const dishID = req.query.dishID;

  const seller = await Seller.findByID(sellerID);
  const dish = await SellerDishes.findDishByID(dishID);

  if (seller && dish) {
    let sellerDishIdArray;
    const deleteImage = await fileHelper.deleteFile(dish.imageURL);
    console.log(deleteImage);

    if (dish.isSpecial == "true" || dish.isSpecial == true) {
      sellerDishIdArray = seller.specialDishesIds;
      let sellerDishNameArray = seller.specialDishesNames;
      let itemIndex = sellerDishIdArray.findIndex((id) => {
        return id.toString() === dish._id.toString();
      });

      sellerDishIdArray.splice(itemIndex, 1);
      sellerDishNameArray = seller.specialDishesNames;
      itemIndex = sellerDishNameArray.indexOf(dish.name);
      sellerDishNameArray.splice(itemIndex, 1);

      const sellerDishDelete = await SellerDishes.deleteDish(dishID);
      console.log(sellerDishDelete)
      const sellerUpdate = await Seller.updateDeletedSellerDishRecord(
        sellerID,
        sellerDishIdArray,
        sellerDishNameArray,
        true
      );
      res.status(200).json({
        message: "Special dish deleted",
      });
    } else{
      sellerDishIdArray = seller.dishIds;
      let itemIndex = sellerDishIdArray.findIndex((id) => {
        return id.toString() === dish._id.toString();
      });
      sellerDishIdArray.splice(itemIndex, 1);
      const sellerDishDelete = await SellerDishes.deleteDish(dishID);
      
      const sellerUpdate = await Seller.updateDeletedSellerDishRecord(
        sellerID,
        sellerDishIdArray,
        null,
        false
      );
      res.status(200).json({
        message: "General dish deleted",
      });
    }
  } else {
    res.status(403).json({
      message: "seller ID or dishID is incorrect",
    });
  }
};
