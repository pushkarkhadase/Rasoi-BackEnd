//importing the validation class
const Validator = require("../../models/validator");

//importing the seller class
const Seller = require("../../models/seller");

exports.getAllNonVadidatedSeller = (req, res, next) => {
  const validatorUsername = "Somesh Lad";
  let sellerArray = [];
  let info = {};
  Validator.findByUsername(validatorUsername).then((validator) => {
    if (validator) {
      const validationList = validator.sellerIds;

      Seller.findMuliSellerByIds(validationList)
        .then((sellerList) => {
          sellerList.forEach((seller) => {
            info = {
              id: seller._id,
              name: seller.sellerName,
              mobileNo: seller.mobileNo,
              panImage: seller.panImage,
              personalImage: seller.personalImage,
            };
            sellerArray.push(info);
          });
          res.status(200).json({
            message: "returning the validation info",
            sellers: sellerArray,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.status(403).json({
        message: "invalid username",
      });
    }
  });
};

exports.validateOrRejectSeller = (req, res, next) => {
  const sellerID = req.body.id;
  //NOTE action -> true -> seller is varified and now going to validate,
  //NOTE action -> false -> seller is rejected and now going to delete it
  const action = req.body.action;

  Seller.findByID(sellerID)
    .then((seller) => {
      if (seller) {
        if (action == "true") {
          //if the action is true we will validate the seller
          Seller.validateSeller(sellerID)
            .then((tem) => {
              Validator.findByUsername("Somesh Lad")
                .then((validator) => {
                  Validator.deleteSellerID(validator.sellerIds, sellerID).then(
                    (result) => {
                      res.status(200).json({
                        message: "seller validated and queue is updated",
                      });
                    }
                  );
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        } else {
          //if the action is false then we will delete the seller
          Seller.deleteRejectedSeller(sellerID)
            .then((tem) => {
              Validator.findByUsername("Somesh Lad")
                .then((validator) => {
                  Validator.deleteSellerID(validator.sellerIds, sellerID).then(
                    (result) => {
                      res.status(200).json({
                        message:
                          "seller rejected resulting into seller Deletion, queue updated!",
                      });
                    }
                  );
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
      } else {
        res.status(403).json({
          message: "seller id is invalid",
        });
      }
    })
    .catch((err) => console.log(err));
};
