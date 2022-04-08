const Consumer = require("../../models/consumer");
const Seller = require("../../models/seller");
const Order = require("../../models/orders");

const stringFormater = require("../../util/stringFormater");
const fileHelper = require("../../util/file");

// function stringFormating(bufferstring) {
//   // string => pushkar khadase
//   //output => Pushkar Khadase
//   let formatedString =
//     bufferstring.charAt(0).toUpperCase() + bufferstring.slice(1);
//   bufferstring = formatedString;

//   for (let i = 1; i < bufferstring.length; i++) {
//     if (bufferstring.charAt(i) == " ") {
//       formatedString =
//         bufferstring.substr(0, i) +
//         " " +
//         bufferstring.charAt(i + 1).toUpperCase() +
//         bufferstring.substr(i + 2, bufferstring.length);
//     }
//   }
//   return formatedString;
// }

exports.getConsumerDashbord = async (req, res, next) => {
  const consumerID = req.query.consumerID;

  let sellerData = [];
  //here
  try {
    const consumer = await Consumer.findById(consumerID);
    const sellers = await Seller.getAllSellers();

    for (sel of sellers) {
      let seller = {
        sellerID: sel._id,
        name: sel.sellerName,
        img: sel.casualImage,
        rating: sel.avgRating,
        dishes: sel.specialDishesNames,
      };
      if (sel.isConfigured === true && sel.isValidated === true) {
        sellerData.push(seller);
      }
    }
    res.status(200).json({
      consumerData: {
        consumerImage: consumer.customerImage ? consumer.customerImage : null,
        consumerName: consumer.name,
        consumerAddress: consumer.address,
      },
      sellersData: sellerData,
    });
  } catch {
    (err) => console.log(err);
  }
};

exports.getSearchSeller = async (req, res, next) => {
  const searchingString = req.query.searchingString;
  const newString = stringFormater.stringFormating(searchingString);
  const sellers = await Seller.searchSellerAndDishes(newString);
  let sellerList = [];
  for (let seller of sellers) {
    //only return the seller who are configured and validated
    console.log(seller.isValidated + " " + seller.isConfigured);

    let sellerModel = {
      sellerID: seller._id,
      name: seller.sellerName,
      img: seller.casualImage,
      rating: seller.avgRating,
      dishes: seller.specialDishesNames,
    };
    if (seller.isValidated === true && seller.isConfigured === true) {
      sellerList.push(sellerModel);
    }
  }
  if (sellers.length > 0) {
    res.status(200).json({
      sellerList: sellerList,
    });
  } else {
    res.status(404).json({
      message: "No result found",
    });
  }
};

exports.sortSellersInOrderFilter = async (req, res, next) => {
  //ascending => true => 1
  //descending => false => -1
  try {
    const consumerID = req.query.consumerID;
    const order =
      req.query.order === "true" || req.query.order === true ? 1 : -1;
    const consumerRes = await Consumer.findById(consumerID);
    if (consumerRes) {
      const sortedSellerList = await Seller.getAllSellersInSortedOrder(order);
      const sellerList = [];
      for (let seller of sortedSellerList) {
        let sellerModel = {
          sellerID: seller._id,
          name: seller.sellerName,
          img: seller.casualImage,
          rating: seller.avgRating,
          dishes: seller.specialDishesNames,
        };
        if (seller.isValidated === true && seller.isConfigured === true) {
          sellerList.push(sellerModel);
        }
      }
      res.status(200).json({
        sellers: sellerList,
      });
    } else {
      res.status(403).json({
        message: "invalid Consumer",
      });
    }
  } catch {
    (err) => {
      console.log(err);
    };
  }
};

exports.getConsumerProfile = async (req, res, next) => {
  const consumerID = req.query.consumerID;
  const consumer = await Consumer.findById(consumerID);
  if (consumer) {
    const orders = [];
    const consumerData = {
      name: consumer.name,
      mobile: consumer.mobileNo,
      address: consumer.address,
      img: consumer.customerImage,
    };
    const orderIDs = consumer.orders;
    const allOrders = await Order.findAllOrdersByIds(orderIDs);
    for (let order of allOrders) {
      let seller = await Seller.findByID(order.sellerId);
      const orderDetails = {
        orderID: order._id,
        sellerName: order.sellerName,
        areaName: seller ? seller.areaName : null,
        pincode: seller ? seller.pinCode : null,
        totalCost: order.totalCost,
        dishes: order.dishes,
        dateTime: order.dateTime,
        orderStatus: order.orderStatus,
        isRated: order.isRated,
      };
      orders.push(orderDetails);
    }
    res.status(200).json({
      consumerInfo: consumerData,
      ordersInfo: orders,
    });
  }
};

exports.editConsumerProfile = async (req, res, next) => {
  if (
    req.files != undefined ||
    req.files != "undefined" ||
    req.body.image != undefined
  ) {
    const consumerID = req.body.consumerID;
    let consumerNewImage = req.files.length > 0 ? req.files[0].path : null;
    console.log(consumerNewImage);
    let name = req.body.name;
    let address = req.body.address;
    const consumer = await Consumer.findById(consumerID);
    console.log(req.body);
    if (consumer) {
      if (
        (consumerNewImage == null || consumerNewImage == "null") &&
        (req.body.image == "null" || req.body.image == null)
      ) {
        consumerNewImage = consumer.customerImage;
        console.log("in the if");
      } else {
        if (consumer.customerImage) {
          console.log("in the else  if");
          fileHelper.deleteFile(consumer.customerImage);
        }
      }
      if (name == "" || name == "null" || name == null) {
        name = consumer.name;
      }

      if (address == "" || address == "null" || address == null) {
        address = consumer.address;
      }
      console.log(name);
      console.log(address);
      const result = await Consumer.updateConsumerDetails(
        consumerID,
        name,
        address,
        consumerNewImage
      );
      if (result) {
        res.status(200).json({
          message: "Consumer updated!",
        });
      }
    } else {
      res.status(403).json({
        message: "invalid Consumer",
      });
    }
  }
};
exports.getEditProfile = async (req, res, next) => {
  const consumerID = req.query.consumerID;
  const consumer = await Consumer.findById(consumerID);
  if (consumer) {
    res.status(200).json({
      consumerName: consumer.name,
      consumerAddress: consumer.address,
      consumerMobileNo: consumer.mobileNo,
    });
  } else {
    res.status("invalid consumerID");
  }
};
