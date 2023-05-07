//tầng giao tiếp và xử lý data
const statusService = require('./service');

//lấy danh sách trạng thái đơn hàng
exports.getStatus = async () => {
    let data = await statusService.getStatus();
    data = data.map((item) => {
        item = {
            _id: item._id,
            name: item.name,
            number: item.number
        }
        return item;
    });
    return data;
}

//lấy trạng thái đơn hàng bằng mã số
exports.getStatusByNumber = async (number) => {
    const data = await statusService.getStatusByNumber(number);
    return data;
}

//lấy trạng thái cho một đơn hàng
exports.getStatusForOrder = async (cartID) => {
    let data = await statusService.getStatus();
    data = data.map((item) => {
        item = {
            _id: item._id,
            name: item.name,
            number: item.number,
            selected: item._id.toString() === cartID.toString()
        }
        return item;
    });
    return data;
}