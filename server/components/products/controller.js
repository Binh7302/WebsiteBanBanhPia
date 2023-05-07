//tầng giao tiếp và xử lý data
const productService = require('./service');

//lấy danh sách sản phẩm
exports.getProduct = async () => {
    let data = await productService.getProduct();
    data = data.map((item, index) => {
        item = {
            _id: item._id,
            categoryID: item.categoryID,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            description: item.description,
            status: item.status,
            weigth: item.weigth,
            ingredient: item.ingredient,
            productManual: item.productManual,
            preserve: item.preserve,
            expirationDate: item.expirationDate,
            brand: item.brand,
            avatarImage: item.avatarImage,
            index: index + 1
        }
        return item;
    });
    return data;
}

//thêm sản phẩm
exports.insert = async (body) => {
    await productService.insert(body);
}

//sửa sản phẩm
exports.update = async (id, body) => {
    await productService.update(id, body)
}

//xóa sản phẩm
exports.delete = async (id) => {
    let data = {};
    data = { ...data, status: 1 };
    await productService.update(id, data);
}

//xóa sản phẩm (just dev)
exports.deleteDev = async (id) => {
    await productService.deleteDev(id);
}

//lấy sản bằng bằng id
exports.getProductById = async (id) => {
    let data = await productService.getProductById(id);
    if(data){
        data = {
            _id: data._id,
            categoryID: data.categoryID,
            name: data.name,
            price: data.price,
            quantity: data.quantity,
            description: data.description,
            status: data.status,
            weigth: data.weigth,
            ingredient: data.ingredient,
            productManual: data.productManual,
            preserve: data.preserve,
            expirationDate: data.expirationDate,
            brand: data.brand,
            avatarImage: data.avatarImage
        }
        return data;
    }else{
        return null;
    }
}

//kiểm tra sản phẩm bằng tên sản phẩm 
exports.getProductByName = async (name) => {
    let data = await productService.getProductByName(name);
    if (data) {
        if (data.status == 0) {
            return true;
        }else{
            return data;
        }
    } else {
        return false;
    }
}

//lấy sản phẩm bằng tên sản phẩm
exports.findProductByName = async (name) => {
    let data = await productService.getProductByName(name);
    return data;
}

