const Orders = require("../../models/orders");
const Consumer = require("../../models/consumer");
const Seller = require("../../models/seller");

function getDate() {
  let dateObj = new Date();
  let day = dateObj.getDate();
  let month = dateObj.getMonth();
  let year = dateObj.getFullYear();
  let hrs = dateObj.getHours();
  let mins = dateObj.getMinutes();
  const dayArr = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUNE",
    "JULY",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const monthString = dayArr[month];
  let hours;
  let meridian;
  if (hrs > 12) {
    hours = hrs - 12;
    meridian = "PM";
  } else {
    hours = hrs;
    meridian = "AM";
  }

  return (formatedDate =
    day +
    " " +
    monthString +
    " " +
    year +
    " at " +
    hours +
    ":" +
    mins +
    " " +
    meridian);
}

exports.placeOrder = async (req, res, next) => {
  const consumerID = req.body.consumerID;
  const sellerID = req.body.sellerID;
  const dishes = req.body.dishes;
  const totalCost = req.body.totalCost;
  const consumer = await Consumer.findById(consumerID);
  const seller = await Seller.findByID(sellerID);
  let consumerName = consumer.name;
  let sellerName = seller.sellerName;
  let consumerPhoneNo = consumer.mobileNo;
  const newDate = getDate();

  if (consumer && seller) {
    const order = new Orders(
      dishes,
      consumerPhoneNo,
      consumerID,
      consumerName,
      sellerID,
      sellerName,
      newDate,
      totalCost
    );
    // need to work on the queue system

    const orderResult = await order.save();
    console.log(orderResult.insertedId);
    const sellerOrderQueue = seller.orders;
    sellerOrderQueue.push(orderResult.insertedId);

    const updateSellerQueue = await Seller.updateOrderQueue(
      sellerID,
      sellerOrderQueue
    );
    const consumerOrderQueue = consumer.orders;
    consumerOrderQueue.push(orderResult.insertedId);
    const updateConsumerQueue = await Consumer.updateOrderQueue(
      consumerID,
      consumerOrderQueue
    );

    res.status(201).json({
      message: "Order Placed",
    });
  } else {
    res.status(403).json({
      message: "Seller or Consumer invalid",
    });
  }
};

exports.rateSeller = async (req, res, next) => {
  const sellerID = req.body.sellerID;
  const consumerID = req.body.consumerID;
  const orderID = req.body.orderID;
  const rating = req.body.rating;

  const seller = await Seller.findByID(sellerID);
  const consumer = await Consumer.findById(consumerID);
  const order = await Orders.findById(orderID);
  if (seller && consumer && order) {
    const rateOrder = await Orders.rateOrder(orderID);
    let numerator = seller.avgRatingNumerator;
    let dinominator = seller.avgRatingDinominator;

    numerator += rating;
    dinominator++;
   let average =  (numerator / dinominator);
   average.toPrecision(2)
    
    const updateRatingsParameters = await Seller.updateRatingsParameters(
      sellerID,
      numerator,
      dinominator,
      average
    );
    return res.status(200).json({
      message: "seller rated!",
    });
  } else {
    res.status(403).json({
      message: "invalid seller, consumer or order IDs",
    });
  }
};
