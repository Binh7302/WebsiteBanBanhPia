//tầng giao tiếp với database
const statusModel = require('./model');

//lấy danh sách trạng thái đơn hàng
exports.getStatus = async () => {
    const data = await statusModel.find();
    return data;
}

//lấy trạng thái đơn hàng bằng mã số
exports.getStatusByNumber = async (number) => {
    const data = await statusModel.findOne({ number: number });
    return data;
}