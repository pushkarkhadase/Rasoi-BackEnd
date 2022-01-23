const express = require('express');

const router = express.Router();

const validatorController = require('../controller/validator');

//  POST /validator/signup
router.post('/signup', validatorController.signup);

module.exports = router;