const Validator = require('../models/validator');
const bcrypt = require("bcryptjs");

exports.signup = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          validator = new Validator(username, hashedPassword);
          return consumer.save();
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
