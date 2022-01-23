//importing the express 
const express = require('express');

//importing the router
const router = express.Router();

//importing the seller controller
const sellerController = require('../controller/seller');

//  POST /seller/signup
router.post('/signup', sellerController.signup);

//exporting the router
module.exports = router;