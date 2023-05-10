//tầng giao tiếp và xử lý data
const amountService = require('./service');

//lấy danh sách trạng thái số lượng sản phẩm
exports.getAmount = async () => {
    let data = await amountService.getAmount();
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

//lấy trạng thái số lượng sản phẩm bằng mã số
exports.getAmountByNumber = async (number) => {
    const data = await amountService.getAmountByNumber(number);
    return data;
}

//lấy trạng thái cho một sản phẩm
exports.getAmountForProduct = async (amountID) => {
    let data = await amountService.getAmount();
    data = data.map((item) => {
        item = {
            _id: item._id,
            name: item.name,
            number: item.number,
            selected: item._id.toString() === amountID.toString()
        }
        return item;
    });
    return data;
}