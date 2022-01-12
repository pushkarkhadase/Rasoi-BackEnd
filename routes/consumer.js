const express = require('express');

const router = express.Router();

const consumerController = require('../controller/consumer');

router.post('/signup', consumerController.signup);

module.exports = router;