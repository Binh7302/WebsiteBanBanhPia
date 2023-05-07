//tầng giao tiếp và xử lý data
const categoryService = require('./service');

//lấy danh sách thể loại
exports.getCategory = async () => {
    let data = await categoryService.getCategory();
    data = data.map((item, index) => {
        item = {
            _id: item._id,
            name: item.name,
            image: item.image,
            driveId: item.driveId,
            index: index + 1
        }
        return item;
    });
    return data;
}

//thêm thể loại
exports.insert = async (data) => {
    await categoryService.insert(data);
}

//sửa thể loại
exports.update = async (id, data) => {
    await categoryService.update(id, data);
}

//xóa thể loại
exports.delete = async (id) => {
    let data = {};
    data = { ...data, status: 1 };
    await categoryService.update(id, data);
}

//xóa thể loại (just dev)
exports.deleteDev = async (id) => {
    await categoryService.deleteDev(id);
}

//lấy thể loại bằng id
exports.getCategoryById = async (id) => {
    let data = await categoryService.getCategoryById(id);
    data = {
        _id: data._id,
        name: data.name,
        image: data.image,
        driveId: data.driveId
    }
    return data;
}

//lấy thể loại bằng tên thể loại
exports.getCategoryByName = async (name) => {
    let data = await categoryService.getCategoryByName(name);
    if (data) {
        if(data.status == 0){
            return true;
        }else{
            return data;
        }
    } else {
        return false;
    }
}

//lấy danh sách thể loại cho sản phẩm
exports.getCategoryForProduct = async (categoryID) => {
    let data = await categoryService.getCategory();
    data = data.map((item) => {
        item = {
            _id: item._id,
            name: item.name,
            selected: item._id.toString() === categoryID.toString()
        }
        return item;
    });
    return data;
}