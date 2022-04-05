const Consumer = require("../../models/consumer");
const Seller = require("../../models/seller");

const stringFormater = require("../../util/stringFormater");

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


