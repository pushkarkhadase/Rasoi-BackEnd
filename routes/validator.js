//importing the express
const express = require('express');

//importing the router
const router = express.Router();

//importing the validator controller
const validatorController = require('../controller/validator');

//  POST /validator/signup
router.post('/signup', validatorController.signup);

//exporting the router
module.exports = router;