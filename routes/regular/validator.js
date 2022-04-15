//importing the express 
const express = require('express');

//importing the router
const router = express.Router();

//importing the seller general controllers
const validatorController = require('../../controller/regular/validator');

// GET /validator/getAllNonVadidatedSeller
router.get('/getAllNonVadidatedSeller', validatorController.getAllNonVadidatedSeller);

// PUT /validator/validateSeller
router.put('/validateSeller', validatorController.validateOrRejectSeller);

//exporting the router
module.exports = router;