//importing the express
const express = require("express");

//importing the router
const router = express.Router();

//importing the consumer Controller
const sellerOrderController = require("../../controller/orders/seller");

router.get("/getOrders", sellerOrderController.getSellerOrders);
router.post("/acceptOrRejectOrder", sellerOrderController.acceptOrRejectOrders);
router.post("/markAsDeliver", sellerOrderController.markAsDeliver);
router.get("/analytics", sellerOrderController.getSellerOrdersAnalytics);


//exporting the router
module.exports = router;
