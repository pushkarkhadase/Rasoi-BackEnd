//importing the validation class
const Validator = require("../../models/validator");

//importing the seller class
const Seller = require("../../models/seller");

//using fast2sms to use sms service
const fast2sms = require("fast-two-sms");

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
      const sellerPhone = seller.mobileNo;
      if (seller) {
        if (action == "true") {
          //if the action is true we will validate the seller
          Seller.validateSeller(sellerID)
            .then((tem) => {
              Validator.findByUsername("Somesh Lad")
                .then((validator) => {
                  Validator.deleteSellerID(validator.sellerIds, sellerID).then(
                    async (result) => {
                      var options = {
                        authorization:
                          "pXuZd7t3KgOslD9wQMeP6Joq2c4iCG8nfHFhN5kmzVYIr0RxTUJxKEpHnLvhFS2YVCd6ABoaeMPqiz4w",
                        message:
                          "Hey Seller,<br> Congratulations! Your Account has been verified, And you can Now login with your credentials(Mobile Number and Password) for setting up your dashboard. <br>Regards,<br>Rasoi Team.",
                        numbers: [sellerPhone],
                      };
                      //uncomment this to start the sms service
                      // const response = await fast2sms
                      //   .sendMessage(options)
                      //   .then((sms_result) => {
                      //     console.log("sms sent");
                      //   })
                      //   .catch((err) => console.log(err));
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
                    async (result) => {
                      var options = {
                        authorization:
                          "pXuZd7t3KgOslD9wQMeP6Joq2c4iCG8nfHFhN5kmzVYIr0RxTUJxKEpHnLvhFS2YVCd6ABoaeMPqiz4w",
                        message:
                          "Hey Seller, We regret to inform you that your account has been temporarily rejected. This is either due to mismatch of documents or the images are not clear. Regards, Rasoi Team",
                        numbers: [sellerPhone],
                      };
                      //uncomment this tooo
                      // const response = await fast2sms
                      //   .sendMessage(options)
                      //   .then((sms_result) => {
                      //     console.log("sms sent");
                      //   })
                      //   .catch((err) => console.log(err));
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
