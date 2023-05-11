//tầng giao tiếp và xử lý data
const productService = require('./service');
const cateService = require('../categories/service');

//lấy danh sách sản phẩm
exports.getProduct = async () => {
    let data = await productService.getProduct();
    data = data.map((item, index) => {
        item = {
            _id: item._id,
            categoryID: item.categoryID,
            name: item.name,
            price: item.price,
            amountID: item.amountID,
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

exports.getProductsForUser = async() => {
    let products = await productService.getProduct();
    let categories = await cateService.getCategory();
    let data = [];
    let temp = [];
    for (let index = 0; index < categories.length; index++) {
        temp = [];
        let t = {};
        for (let j = 0; j < products.length; j++) {
            console.log("a: " + products[j].categoryID._id + " b: " + categories[index]._id);
            if (products[j].categoryID._id.equals(categories[index]._id) ) {
                console.log("giống");
                temp.push(products[j]);
                console.log("product: " + products[j]);
                console.log("temp1: " + temp);
            }

        }
        console.log("temp: " + temp);
        if(temp.length>0){
            t = { category: categories[index], products: temp }
        }
        data.push(t);
    }
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
    if (data) {
        data = {
            _id: data._id,
            categoryID: data.categoryID,
            name: data.name,
            price: data.price,
            amountID: data.amountID,
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
    } else {
        return null;
    }
}

//kiểm tra sản phẩm bằng tên sản phẩm 
exports.getProductByName = async (name) => {
    let data = await productService.getProductByName(name);
    if (data) {
        if (data.status == 0) {
            return true;
        } else {
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

//tìm kiếm sản phẩm
exports.getProductBySearchValue = async (value) => {
    let data = await productService.getProductBySearchValue(value);
    data = data.map((item, index) => {
        item = {
            _id: item._id,
            categoryID: item.categoryID,
            name: item.name,
            price: item.price,
            amountID: item.amountID,
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