//tầng giao tiếp với database
const productModel = require('./model');

//lấy danh sách sản phẩm
exports.getProduct = async () => {
    const data = await productModel.find({ status: 0 }).populate('categoryID amountID').sort('categoryID');
    return data;
}

//thêm sản phẩm
exports.insert = async (body) => {
    const data = new productModel(body);
    await data.save();
}       

//sửa sản phẩm
exports.update = async (id, body) => {
    await productModel.findByIdAndUpdate(id, body);
}

//xóa sản phẩm (just dev)
exports.deleteDev = async (id) => {
    await productModel.findByIdAndDelete(id);
}

//lấy sản phẩm bằng id
exports.getProductById = async (id) => {
    const data = await productModel.findById(id).populate('categoryID amountID');
    return data;
}

//lấy sản phẩm bằng tên sản phẩm
exports.getProductByName = async (name) => {
    const data = await productModel.findOne({ name: name }).populate('categoryID amountID');
    return data;
}

//tìm kiếm sản phẩm
exports.getProductBySearchValue = async (value) => {
    const data = await productModel.find({ name: { $regex: value, $options: 'i' } }).populate('categoryID amountID').sort('categoryID');
    return data;
}

//lấy danh sách tất cả sản phẩm
exports.getAllProduct = async () => {
    const data = await productModel.find().populate('categoryID amountID').sort('categoryID');
    return data;
}