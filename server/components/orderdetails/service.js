//tầng giao tiếp với database
const orderDetailModel = require('./model');
const orderModel = require('../orders/model');
const statusController = require('../status/controller');
const productController = require('../products/controller');

//lấy đơn hàng chi tiết bằng orderID
exports.getOrderDetailByOrderID = async (id) => {
    const data = await orderDetailModel.find({ orderID: id }).populate('orderID productID');
    return data;
}

//sửa đơn hàng
exports.update = async (id, body) => {
    await orderDetailModel.findByIdAndUpdate(id, body);
}

//tạo đơn hàng 
exports.insert = async (body) => {
    const data = new orderDetailModel(body);
    return await data.save();
}

//lấy thống kê sản phẩm
exports.productStat = async () => {
    //lấy trạng thái đã hoàn thành
    const status = await statusController.getStatusByNumber(1);
    //lấy giỏ hàng có trạng thái đã hoàn thành
    let cart = await orderModel.aggregate([
        { $match: { statusID: status._id } },
        { $group: { _id: "$_id" } }
    ]);
    //cart = [{_id: 1}, {_id: 2}, {_id: 3}, ... ];
    const productID = [];
    //đưa tất cả giỏ hàng có trạng thái đã hoàn thành vào 1 mảng
    for (let i = 0; i < cart.length; i++) {
        //tạo 1 mảng tạm, 1 flag = 1 cart
        let flag = [];
        flag = await orderDetailModel.aggregate([
            { $match: { orderID: cart[i]._id } },
            { $group: { _id: "$productID", amount: { $sum: "$quantityPurchased" }, total: { $sum: { $multiply: ["$pricePurchased", "$quantityPurchased"] } } } }
        ]);
        //flag = [{_id: productID1, amount: 1, total: 10}, {_id: productID2, amount: 5, total: 100}, ... ];
        //đưa mảng flag vào mảng productID
        for (let i = 0; i < flag.length; i++) {
            productID.push(flag[i]);
            //productID = [{_id: productID1, amount: 1, total: 10}, {_id: productID2, amount: 5, total: 100},
            //{_id: productID1, amount: 5, total: 50}, ... ];
        }
    }
    const productStat = [];
    const p = await productController.getProduct();
    //hợp các biến có chung _id, cộng số lượng đã mua và tổng tiền của mỗi đơn hàng
    for (let i = 0; i < p.length; i++) {
        //tạo biến tạm
        let flagAmount = 0;
        let flagTotal = 0;
        for (let j = 0; j < productID.length; j++) {
            //so sánh _id của productID and p
            if (productID[j]._id.equals(p[i]._id)) {
                //cộng vào biến tạm
                flagAmount += parseInt(productID[j].amount);
                flagTotal += parseInt(productID[j].total);
            }
        }
        let temp = { _id: p[i]._id, name: p[i].name, amount: flagAmount, total: flagTotal };
        productStat.push(temp);
    }
    return productStat;
}