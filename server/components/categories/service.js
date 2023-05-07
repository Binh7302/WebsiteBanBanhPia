//tầng giao tiếp với database
const categoryModel = require('./model');

//lấy danh sách thể loại
exports.getCategory = async () => {
    const data = await categoryModel.find({status: 0});
    return data;
}

//thêm thể loại
exports.insert = async (body) => {
    const data = new categoryModel(body);
    await data.save();
}

//sửa thể loại
exports.update = async (id, body) => {
    await categoryModel.findByIdAndUpdate(id, body);
}

//xóa thể loại (just dev)
exports.deleteDev = async (id) => {
    await categoryModel.deleteByIdAndDelete(id);
}

//lấy thể loại bằng id
exports.getCategoryById = async (id) => {
    const data = await categoryModel.findById(id);
    return data;
}

//lấy thể loại bằng tên thể loại
exports.getCategoryByName = async (name) => {
    const data = await categoryModel.findOne({ name: name });
    return data;
}