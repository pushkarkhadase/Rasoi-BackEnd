//importing the validation class 
const Validator = require('../models/validator');
//importing the bcrypt for the incryption
const bcrypt = require("bcryptjs");

//logic for validation signup
exports.signup = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    //hashing the password and storing the validator into the database
    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          validator = new Validator(username, hashedPassword);
          return validator.save();
        })
        .then((result) => {
          res.status(201).json({
            message: "Validator Created!!!",
            data: { username },
          });
        })
        .catch((err) => {
          console.log(err);
        });
}
