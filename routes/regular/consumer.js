//importing the express 
const express = require('express');

//importing the router
const router = express.Router();

//importing the consumer Controller
const consumerController = require("../../controller/regular/consumer");

// GET /consumer/ConsumerDashbord
router.get("/consumerDashbord", consumerController.getConsumerDashbord);

//exporting the router
module.exports = router;