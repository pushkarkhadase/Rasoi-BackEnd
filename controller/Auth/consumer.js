//importing the consumer class model
const Consumer = require("../../models/consumer");
//using the bcrypt for encrypting the password of the consumer
const bcrypt = require("bcryptjs");

//controller for signup logic and functionality
exports.signup = (req, res, next) => {
  //checking if all field recieved are filled properly and not empty so the they will not crash the server
  if (
    req.body.name ||
    req.body.address ||
    req.body.mobileNo ||
    req.body.password
  ) {
    //getting all the data from the body of the req
    const name = req.body.name;
    const address = req.body.address;
    const mobileNo = req.body.mobileNo;
    const password = req.body.password;

    //searching if the same user exist already so that there should be multiple sighin from the same acc
    Consumer.findByMobileNo(mobileNo).then((foundedConsumer) => {
      //if same user found we are rejecting the signin operation
      if (foundedConsumer) {
        res.status(403).json({
          message:
            "User already exhist on this Phone Number please try the Different Number",
          data: { mobileNo },
        });
      } else {
        //incrypting the received password so that we can store it into the database
        bcrypt
          .hash(password, 12)
          .then((hashedPassword) => {
            consumer = new Consumer(name, mobileNo, address, hashedPassword);
            //adding the userinto the data base
            return consumer.save();
          })
          .then((result) => {
            //sending the message to the frontend that the user have been created
            res.status(201).json({
              "message" : "User Created!!!",
              "data" : { name, mobileNo, address },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  } else{
    res.status(403).json({
      "message" : "one of the field was empty and the request was denied"
    })
  }
};
