//importing the express 
const express = require('express');

//importing the router
const router = express.Router();

//importing the seller authorization controllers
const sellerAuthController = require('../../controller/Auth/seller');

//  POST /seller/signup
router.post('/signup', sellerAuthController.signup);

//  POST /seller/signin
router.post('/signin', sellerAuthController.signin);

//exporting the router
module.exports = router;