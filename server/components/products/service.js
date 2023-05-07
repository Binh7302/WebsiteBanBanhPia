//tầng giao tiếp với database
const productModel = require('./model');

//lấy danh sách sản phẩm
exports.getProduct = async () => {
    const data = await productModel.find({ status: 0 }).populate('categoryID');
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
    const data = await productModel.findById(id).populate('categoryID');;
    return data;
}

//lấy sản phẩm bằng tên sản phẩm
exports.getProductByName = async (name) => {
    const data = await productModel.findOne({ name: name }).populate('categoryID');
    return data;
}