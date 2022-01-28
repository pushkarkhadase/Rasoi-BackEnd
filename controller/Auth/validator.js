//importing the validation class
const Validator = require("../../models/validator");
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
};

// exports.signin = (req, res, next) => {
//   const mobileNo = req.body.username;
//   const password = req.body.password;
//   if (mobileNo && password) {
//     Seller.findByMobileNo(mobileNo)
//       .then((seller) => {
//         if (seller) {
//           if(seller.isValidated){
//             bcrypt.compare(password, seller.password).then((doMatch) => {
//               if (doMatch) {
//                 res.status(200).json({
//                   message : "user authenticated",
//                   seller_ID: seller._id,
//                   configured : seller.isConfigured
//                 });
//               } else {
//                 res.status(401).json({
//                   message: "user password didnt match",
//                 });
//               }
//             });
//           } else {
//             res.status(403).json({
//               message : "Seller is not validated"
//             })
//           }
          
//         } else {
//           res.status(404).json({
//             message: "user not found",
//           });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   } else {
//     res.status(422).json({
//       message: "either mobile number or password or both are empty",
//     });
//   }
// };
