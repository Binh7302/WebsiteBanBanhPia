//tầng giao tiếp với database
const amountModel = require('./model');

//lấy danh sách trạng thái số lượng sản phẩm
exports.getAmount = async () => {
    const data = await amountModel.find();
    return data;
}

//lấy trạng thái số lượng sản phẩm bằng mã số
exports.getAmountByNumber = async (number) => {
    const data = await amountModel.findOne({ number: number });
    return data;
}