//importing the express
const express = require('express');

//importing the router
const router = express.Router();

//importing the validator controller
const validatorController = require('../../controller/Auth/validator');

//  POST /validator/signup
router.post('/signup', validatorController.signup);

//  POST /validator/signin
router.post('/signin', validatorController.signin);

//exporting the router
module.exports = router;