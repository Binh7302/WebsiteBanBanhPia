//tầng giao tiếp và xử lý data
const PIService = require('./service');

//lấy hình ảnh sản phẩm bằng productID
exports.getPIByProductID = async (productID) => {
    let data = await PIService.getPIByProductID(productID);
    if(data){
        return data;
    }else{
        return null;
    }
}

//lấy hình ảnh sản phẩm bằng productID và số thứ tự
exports.getPIByProductIDandNumber = async (productID, number) => {
    let data = await PIService.getPIByProductIDandNumber(productID,number);
    if(data.length != 0){
        return data;
    }else{
        return null;
    }
}

//thêm hình ảnh sản phẩm
exports.insert = async (body) => {
    await PIService.insert(body);
}

//sửa hình ảnh sản phẩm
exports.update = async (id, body) => {
    await PIService.update(id, body);
}

//xóa hình ảnh sản phẩm
exports.delete = async (id) => {
    await PIService.delete(id);
}