//tầng giao tiếp với database
const PIModel = require('./model');

//lấy danh sách hình ảnh bằng id sản phẩm
exports.getPIByProductID = async (productID) => {
    const data = await PIModel.find({ productID: productID }).populate('productID').sort('number');
    return data;
}

//lấy hình ảnh sản phẩm bằng productID và số thứ tự
exports.getPIByProductIDandNumber = async (productID, number) => {
    const data = await PIModel.find({ productID: productID, number: number }).populate('productID');
    return data;
}

//thêm hình ảnh sản phẩm
exports.insert = async (body) => {
    const data = new PIModel(body);
    await data.save();
}

//sửa hình ảnh sản phẩm
exports.update = async (id, body) => {
    await PIModel.findByIdAndUpdate(id, body);
}

//xóa hình ảnh sản phẩm
exports.delete = async (id) => {
    await PIModel.findByIdAndDelete(id);
}