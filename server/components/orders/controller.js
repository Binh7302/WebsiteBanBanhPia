//tầng giao tiếp và xử lý data
const orderService = require('./service');
const date = require('../../utils/format_date');
const statusController = require('../status/controller');

//lấy tất cả đơn hàng
exports.getOrder = async () => {
    let data = await orderService.getOrder();
    data = data.map((item, index) => {
        item = {
            _id: item._id,
            statusID: item.statusID,
            createdAt: date.format(item.createdAt, 1),
            total: item.total,
            name: item.name,
            phonenumber: item.phonenumber,
            address: item.address,
            index: index + 1
        }
        return item;
    });
    return data;
}

//lấy đơn hàng đang xử lý
exports.getOrderProcessing = async () => {
    const status = await statusController.getStatusByNumber(0);
    let data = await orderService.getOrderByStatusID(status._id);
    data = data.map((item, index) => {
        item = {
            _id: item._id,
            statusID: item.statusID,
            createdAt: date.format(item.createdAt, 1),
            total: item.total,
            name: item.name,
            phonenumber: item.phonenumber,
            address: item.address,
            index: index + 1
        }
        return item;
    });
    return data;
}

//lấy đơn hàng bằng id
exports.getOrderById = async (id) => {
    let data = await orderService.getOrderById(id);
    data = {
        _id: data._id,
        statusID: data.statusID,
        createdAt: date.format(data.createdAt, 1),
        total: data.total,
        name: data.name,
        phonenumber: data.phonenumber,
        address: data.address
    }
    return data;
}

//lấy đơn hàng bằng thông tin khởi tạo
exports.getOrderByInfo = async (name, phone, address, date) => {
    let data = await orderService.getOrderByInfo(name, phone, address, date);
    return data;
}

//sửa đơn hàng
exports.update = async (id, body) => {
    await orderService.update(id, body);
}

//tạo đơn hàng 
exports.insert = async (body) => {
    await orderService.insert(body);
}

//tìm kiếm đơn hàng
exports.getOrderBySearchValue = async (searchValue, processing) => {
    let data = await orderService.getOrderBySearchValue(searchValue, processing);
    data = data.map((item, index) => {
        item = {
            _id: item._id,
            statusID: item.statusID,
            createdAt: date.format(item.createdAt, 1),
            total: item.total,
            name: item.name,
            phonenumber: item.phonenumber,
            address: item.address,
            index: index + 1
        }
        return item;
    })
    return data;
}