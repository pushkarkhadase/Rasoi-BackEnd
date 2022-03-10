const Consumer = require("../../models/consumer");
const Seller = require("../../models/seller");
const SellerDishes = require("../../models/sellerDishes");

//under maintance
exports.getConsumerDashbord = async (req, res, next) => {
  const consumerID = req.query.consumerID;
  let sellerData = [];
  //here
  try {
    console.log('going into the Consumer find by id');
    const consumer = await Consumer.findById(consumerID);
    console.log('going into the Seller getAllSellers');
    const sellers = await Seller.getAllSellers();
    console.log("printing all sellers");
    console.log(sellers);
    for(sel of sellers) {

      console.log('going into the SellerDishes find multi seller dishes');
      const dishes = await SellerDishes.findMultiSellerDishes(
        sel.specialDishesIds
      );
      console.log('printing the dishes');
      console.log(dishes);
      let sellerDisheslist = [];

      dishes.map((dish) => {
        sellerDisheslist.push(dish.name);
      });
      let seller = {
        sellerID : sel._id,
        name: sel.sellerName,
        img: sel.casualImage,
        rating: sel.avgRating,
        dishes: sellerDisheslist,
      };
      sellerData.push(seller);
    }

    console.log('printing the sellers data');
    console.log(sellerData)
    res.status(200).json({
      consumerData: {
        consumerImage: consumer.customerImage ? consumer.customerImage : null,
      },
      sellersData: sellerData,
    });
  } catch {
    (err) => console.log(err);
  }

  // Consumer.findById(consumerID)
  //   .then((consumer) => {
  //     Seller.getAllSellers().then((sellers) => {
  //       sellers.forEach((sel) => {
  //         SellerDishes.findMultiSellerDishes(sel.specialDishesIds).then(
  //           (dishes) => {
  //             let sellerDisheslist = [];
  //             dishes.forEach((dish) => {
  //               sellerDisheslist.push(dish.name);
  //             });
  //             let seller = {
  //               name: sel.name,
  //               img: sel.casualImage,
  //               rating: sel.avgRating,
  //               dishes: sellerDisheslist
  //             };
  //             sellerData.push(seller);
  //           }
  //         ).catch(err => {console.log(err)});
  //       });

  //       res.status(200).json({
  //           consumerData : {consumerImage : consumer.customerImage ? consumer.customerImage : null},
  //           sellersData: sellerData
  //       })
  //     }).catch(err => console.log(err));
  //   })
  //   .catch((err) => console.log(err));
};
