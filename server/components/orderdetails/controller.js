//tầng giao tiếp và xử lý data
const orderDetailService = require('./service');

//lấy đơn hàng chi tiết bằng orderID
exports.getOrderDetailByOrderID = async (id) => {
    let data = await orderDetailService.getOrderDetailByOrderID(id);
    data = data.map((item, index) => {
        item = {
            id: item.id,
            orderID: item.orderID,
            productID: item.productID,
            quantityPurchased: item.quantityPurchased,
            pricePurchased: item.pricePurchased,
            index: index + 1
        }
        return item;
    });
    return data;
}

//thêm đơn hàng chi tiết
exports.insert = async (body) => {
    await orderDetailService.insert(body);
}

//lấy thống kê sản phẩm
exports.productStat = async () => {
    let data = await orderDetailService.productStat();
    return data;
}

exports.deleteAll = async () => {  
    await orderDetailService.deleteAll();
}