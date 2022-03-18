//Importing the seller class model
const Seller = require("../../models/seller");
//Importing the validator class model
const Validator = require("../../models/validator");
//Importing the filehelper function in order to delete the files form the server
const fileHelper = require("../../util/file");
//importing the string Formating function
const stringFormater = require("../../util/stringFormater");

//for encrypting the password
const bcrypt = require("bcryptjs");

exports.signup = (req, res, next) => {
  //  (working state)

  //checking if the image files are valid and error proof so it will not crash the server
  if (req.files) {
    //getting all the data from the request body
    const sellerNameTemp = req.body.sellerName;
    const sellerName = stringFormater.stringFormating(sellerNameTemp);
    const mobileNo = req.body.mobileNo;
    const password = req.body.password;
    //getting the image file name and path so that it can be saved into the database
    const panImage = req.files[0].path;
    const personalImage = req.files[1].path;

    //initializing the seller id as null so that it can be used for later user after the seller have been
    //created succesfully as after creating we will get the random id
    let sellerID = null;

    //till now all the image data is valid but now checking all the text data if its a invalid one
    if (sellerName != null && mobileNo != null) {
      //seaching for the seller if the seller already exist into the sytem
      Seller.findByMobileNo(mobileNo)
        .then((foundedSeller) => {
          //if seller is found we need to abort the signup process
          if (foundedSeller) {
            //here we are not uploading any thing into the db till now but we have already got the images
            //of seller that we need to get rid of as they are irrelevent.
            //logic for deleting the file
            //deleting the PAN Card Image
            fileHelper.deleteFile(panImage);
            //deleting the personal Image
            fileHelper.deleteFile(personalImage);

            

            //reporting to the front end that the seller is already exsisting
            res.status(403).json({
              message: "Seller Already exist on that Phone No",
              mobileNo: mobileNo,
            });
          } else {
            //but if the seller is new we will continue with the sign up process

            //cyphering the seller password
            bcrypt
              .hash(password, 12)
              .then((hashedPassword) => {
                //adding the seller into the database
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
                //getting the newly created seller's id so that we can add that id into the validator's
                //queue for validation
                
                //storing that value into the local variable
                sellerID = seller.insertedId;
              })
              .then((result) => {
                //we have only one validator as Somesh so we hard coaded his name to search him
                return Validator.findByUsername("Somesh Lad");
              })
              .then((validator) => {
                //adding the newly creadted seller into the queue of the validator
                return Validator.addSellerToValidationQueue(
                  validator,
                  sellerID
                );
              })
              .then((result) => {
                //sending the response to the frontend for successfull creation 
                res.status(201).json({
                  message: "Seller Created!!!"
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch();
    } else {
      //if the name or the mobile number is missing the repoting it to the front end and aborting the process
      res.status(406).json({
        message: "Please provide the name and mobile number",
      });
    }
  } else {
    // if images are not in the good format or empty then reporting to the front end
    res.status(422).json({
      message: "Images are in unsupported format",
    });
  }
};

exports.signin = (req, res, next) => {
  const mobileNo = req.body.mobileNo;
  const password = req.body.password;
  if (mobileNo && password) {
    Seller.findByMobileNo(mobileNo)
      .then((seller) => {
        if (seller) {
          if(seller.isValidated){
            bcrypt.compare(password, seller.password).then((doMatch) => {
              if (doMatch) {
                res.status(200).json({
                  message : "user authenticated",
                  seller_ID: seller._id,
                  configured : seller.isConfigured
                });
              } else {
                res.status(401).json({
                  message: "user password didnt match",
                });
              }
            });
          } else {
            res.status(403).json({
              message : "Seller is not validated"
            })
          }
          
        } else {
          res.status(404).json({
            message: "user not found",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(422).json({
      message: "either mobile number or password or both are empty",
    });
  }
};
