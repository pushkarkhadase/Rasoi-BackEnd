const Seller = require('../../models/seller');
const Order = require('../../models/orders');
const Consumer = require('../../models/consumer');

exports.getSellerOrders = async (req, res, next) => {
    const sellerID = req.body.sellerID;

    const seller = await Seller.findByID(sellerID);
    if(seller){
        const allIncompleteOrders = await Order.findIncompleteOrders(seller.orders);
    }


}