const express = require('express');

const router = express.Router();

const consumerController = require('../controller/consumer');

//  POST /consumer/signup
router.post('/signup', consumerController.signup);

module.exports = router;