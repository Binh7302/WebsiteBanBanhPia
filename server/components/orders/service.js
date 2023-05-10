//tầng giao tiếp với database
const orderModel = require('./model');
const statusController = require('../status/controller');

//lấy tất cả đơn hàng
exports.getOrder = async () => {
    const data = await orderModel.find().populate('statusID').sort('createdAt');
    return data;
}

//lấy đơn hàng bằng statusID
exports.getOrderByStatusID = async (statusID) => {
    const data = await orderModel.find({ statusID: statusID }).populate('statusID').sort('createdAt');
    return data;
}

//lấy đơn hàng bằng id
exports.getOrderById = async (id) => {
    const data = await orderModel.findById(id).populate('statusID');
    return data;
}

//lấy đơn hàng bằng thông tin khởi tạo
exports.getOrderByInfo = async (name, phone, address, date) => {
    const data = await orderModel.find({ name: name, phonenumber: phone, address: address, createdAt: date }).populate('statusID');
    return data;
}

//sửa đơn hàng
exports.update = async (id, body) => {
    await orderModel.findByIdAndUpdate(id, body);
}

//tạo đơn hàng 
exports.insert = async (body) => {
    const data = new orderModel(body);
    return await data.save();
}

//tìm kiếm đơn hàng
exports.getOrderBySearchValue = async (value, processing) => {
    if (processing) {
        const status = await statusController.getStatusByNumber(0);
        const data = orderModel.find({ statusID: status._id, name: { $regex: value, $options: 'i' } }).populate('statusID').sort('createdAt');
        return data;
    } else {
        const data = orderModel.find({ name: { $regex: value, $options: 'i' } }).populate('statusID').sort('createdAt');
        return data;
    }
}
