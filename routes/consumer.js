//importing the express
const express = require('express');

//importing the router to use route system
const router = express.Router();

//importing the consumer controlles
const consumerController = require('../controller/consumer');

//  POST /consumer/signup
router.post('/signup', consumerController.signup);

//exporting the router
module.exports = router;