//importing the express 
const express = require('express');

//importing the router
const router = express.Router();

//importing the consumer Controller
const consumerOrderController = require("../../controller/orders/consumer");

router.post('/placeOrder', consumerOrderController.placeOrder);

//exporting the router
module.exports = router;