const Seller = require("../../models/seller");
const Order = require("../../models/orders");
const Consumer = require("../../models/consumer");

exports.getSellerOrders = async (req, res, next) => {
  const sellerID = req.query.sellerID;

  const seller = await Seller.findByID(sellerID);
  if (seller) {
    const sellerOrders = [];
    const allOrders = await Order.findIncompleteOrders(seller.orders);

    for (let order of allOrders) {
      if (order.orderStatus == "Pending" || order.orderStatus == "Prepairing") {
        sellerOrders.push(order);
      }
    }
    if (sellerOrders.length > 0) {
      res.status(200).json({
        orders: sellerOrders,
        message: "orders",
      });
    } else {
      res.status(200).json({
        message: "no orders till now!!!",
      });
    }
  } else {
    res.status(403).json({
      message: "invalid Seller",
    });
  }
};

exports.acceptOrRejectOrders = async (req, res, next) => {
  const sellerID = req.body.sellerID;
  const orderID = req.body.orderID;
  //   const consumerID = req.body.consumerID;
  const action = req.body.action;
  //if action is true => accept the order else => reject the order
  const seller = await Seller.findByID(sellerID);
  const order = await Order.findById(orderID);
  if (seller && order) {
    if (action == "true" || action == true) {
      //logic for accepting the order
      const updateOrderStatus = await Order.updateOrderStatus(
        orderID,
        "Prepairing"
      );
      return res.status(200).json({
        message: "Order is been Prepared",
        state: "Prepairing",
      });
      //   order.save();
    } else {
      // logic for rejecting the order
      const orderIDList = seller.orders;
      console.log("printing the orders" + orderIDList);
      let orderIndex = orderIDList.findIndex((id) => {
        return id.toString() === orderID.toString();
      });

      orderIDList.splice(orderIndex, 1);

      // const updateSellerOrders = await Seller.deleteOrderID(
      //   sellerID,
      //   orderIDList
      // );
      const updateOrderStatus = await Order.updateOrderStatus(
        orderID,
        "Rejected"
      );
      res.status(200).json({
        message: "Order Rejected",
      });
    }
  } else {
    res.status(403).json({
      message: "invalid seller or order ID",
    });
  }
};

exports.markAsDeliver = async (req, res, next) => {
  const sellerID = req.body.sellerID;
  const orderID = req.body.orderID;
  const seller = await Seller.findByID(sellerID);
  const order = await Order.findById(orderID);

  if (seller && order) {
    const updateOrderStatus = await Order.updateOrderStatus(
      orderID,
      "Delivered"
    );
    return res.status(200).json({ message: "Status changed to delivered" });
  } else {
    return res.status(304).json({
      message: "Invalid Seller or Order ID",
    });
  }
};

exports.getSellerOrdersAnalytics = async (req, res, next) => {
  const sellerID = req.query.sellerID;

  const seller = await Seller.findByID(sellerID);

  if (seller) {
    const allSellerOrders = await Order.findAllOrdersByIds(seller.orders);
    let acceptedOrders = 0;
    let rejectedOrders = 0;
    let pendingOrders = 0;
  
    allSellerOrders.forEach(order => {
      if (order.orderStatus == "Pending") {
        console.log("pending");
        pendingOrders++;
      } else if (
        order.orderStatus == "Prepairing" ||
        order.orderStatus == "Delivered"
      ) {
        console.log("accepted");
        acceptedOrders++;
      } else {
        console.log("rejected");
        rejectedOrders++;
      }
    });
      console.log("accepted:- " + acceptedOrders + "rejected:- " + rejectedOrders + "pending:- " + pendingOrders)
      return res.status(200).json({
        accepted: acceptedOrders,
        rejected: rejectedOrders,
        pending: pendingOrders,
      });
  } else {
    return res.status(403).json({
      message: "invalid sellerID",
    });
  }
};
