const Seller = require("../models/seller");
const Validator = require("../models/validator");
const fileHelper = require("../util/file");

const bcrypt = require("bcryptjs");

exports.signup = (req, res, next) => {
  // basic functionality till now, will do that in future. (working state)
  // adding the image logic to save into the server and database (working state)
  // adding the logic to determine the preExisting Seller (working state)

  if (req.files) {
    const sellerName = req.body.sellerName;
    const mobileNo = req.body.mobileNo;
    const password = req.body.password;
    const panImage = req.files[0].path;
    const personalImage = req.files[1].path;
    let sellerID = null;
    if (sellerName != null && mobileNo != null) {
      Seller.findByMobileNo(mobileNo)
        .then((foundedSeller) => {
          if (foundedSeller) {
            //here we are not uploading any thing into the db till now but we have already got the images
            //of seller that we need to get rid of as they are irrelevent. I will code it at the time of
            //edit image functionalities as it will also need delete operation.
            //logic goes here ...

            //logic for deleting the file
            //deleting the PAN Card Image
            fileHelper.deleteFile(panImage);
            //deleting the personal Image
            fileHelper.deleteFile(personalImage);

            console.log("as user already exist all image files are delete");

            res.status(403).json({
              message: "Seller Already exist on that Phone No",
              mobileNo: mobileNo,
            });
          } else {
            bcrypt
              .hash(password, 12)
              .then((hashedPassword) => {
                const seller = new Seller(
                  sellerName,
                  mobileNo,
                  hashedPassword,
                  panImage,
                  personalImage
                );
                return seller.save();
              })
              .then((seller) => {
                console.log("adding the seller ID into the sellerId variable");
                sellerID = seller.insertedId;
              })
              .then((result) => {
                return Validator.findByUsername("Somesh Lad");
              })
              .then((validator) => {
                console.log("priniting the validator")
                return Validator.addSellerToValidationQueue(validator, sellerID);
              })
              .then((result) => {
                //Logic to save the seller _id into the validator document goes here ...
                console.log("displaying the result after updating the validator");
                console.log(result);
                res.status(201).json({
                  message: "Seller Created!!!",
                  data: { sellerName, mobileNo },
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch();
    } else {
      res.status(422).json({
        message: "Please provide the name and mobile number",
      });
    }
  } else {
    res.status(422).json({
      message: "Images are in unsupported format",
    });
  }
};
