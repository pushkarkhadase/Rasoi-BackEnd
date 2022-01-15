const Consumer = require("../models/consumer");
const bcrypt = require("bcryptjs");

exports.signup = (req, res, next) => {
  const name = req.body.name;
  const address = req.body.address;
  const mobileNo = req.body.mobileNo;
  const password = req.body.password;

  Consumer.findByMobileNo(mobileNo).then((foundedConsumer) => {
    if (foundedConsumer) {
      res.status(403).json({
        message:
          "User already exhist on this Phone Number please try the Different Number",
        data: { mobileNo },
      });
    } else {
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          consumer = new Consumer(name, mobileNo, address, hashedPassword);
          return consumer.save();
        })
        .then((result) => {
          res.status(201).json({
            message: "User Created!!!!!!",
            data: { name, mobileNo, address },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};
