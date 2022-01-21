const express = require('express');

const router = express.Router();

const sellerController = require('../controller/seller');

//  POST /validator/signup
router.post('/signup', sellerController.signup);

module.exports = router;