//importing the express 
const express = require('express');

//importing the router
const router = express.Router();

//importing the consumer Controller
const consumerController = require("../../controller/regular/consumer");

// GET /consumer/ConsumerDashbord
router.get("/consumerDashbord", consumerController.getConsumerDashbord);

//GET /consumer/search
router.get("/search", consumerController.getSearchSeller);

//GET /consumer/filter
router.get("/filter", consumerController.sortSellersInOrderFilter);

//GET /consumer/profile
router.get("/profile", consumerController.getConsumerProfile);

//PUT /consumer/editProfile
router.put("/editProfile", consumerController.editConsumerProfile);

//exporting the router
module.exports = router;