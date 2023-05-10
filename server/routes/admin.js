var express = require('express');
var router = express.Router();

require('dotenv').config;
const categoryController = require('../components/categories/controller');
const productController = require('../components/products/controller');
const PIController = require('../components/productimages/controller');
const orderController = require('../components/orders/controller');
const orderDetailController = require('../components/orderdetails/controller');
const statusController = require('../components/status/controller');
const amountController = require('../components/amount/controller');
const jwt = require('jsonwebtoken');
const authentication = require('../middleware/authentication');
const upload = require('../middleware/upload');
const clientRedis = require('../middleware/redis');
const passport = require("passport");
require("../middleware/passport")(passport);
const { uploadFile, deleteFile } = require('../middleware/drive');
const GOOGLE_DRIVE = process.env.GOOGLE_DRIVE;

//GOOGLE LOGIN
//http://localhost:8080/admin/login
router.get('/login', [authentication.checkLoginAdmin], (req, res, next) => {
    try {
        return res.render('login', { title: 'Login' });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});
//http://localhost:8080/admin/auth/google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }), async (req, res, next) => {
});

//http://localhost:8080/admin/auth/google/callback
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), async (req, res, next) => {
    try {
        if (req.user != 'false') {
            clientRedis.setex(process.env.TOKEN_LOGIN, 3601, 0);
            clientRedis.get(process.env.TOKEN_LOGIN, async (err, data) => {
                clientRedis.set(process.env.TOKEN_LOGIN, parseInt(data) + 1);
                const token = jwt.sign({ user: req.user }, process.env.JWT_ADMIN_KEY, { expiresIn: '1h' });
                clientRedis.setex(parseInt(data) + 1, 3600, token);
            });
            req.session.tokenClient = true;
            return res.redirect('/admin/product');
        } else {
            return res.redirect('/admin/login');
        }
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/logout-admin
router.get('/logout-admin', [authentication.checkLoginAdmin], (req, res, next) => {
    try {
        req.session.destroy(function (err) {
            res.clearCookie(process.env.SESS_NAME);
            clientRedis.del(clientRedis.get(process.env.TOKEN_LOGIN));
            clientRedis.del(process.env.TOKEN_LOGIN);
            return res.redirect('/admin/login');
        });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//CATEGORY
//http://localhost:8080/admin/category
router.get('/category', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const data = await categoryController.getCategory();
        return res.render('list_category', { title: 'Category', data: data });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/add-category
router.get('/add-category', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        return res.render('add_category', { title: 'Add Category' });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/add-category
router.post('/add-category', [upload.single('image'), authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        let { body, file } = req;
        const result = await categoryController.getCategoryByName(body.name);
        if (result == true) {
            return res.redirect('/admin/add-category');
        } else if (result == false) {
            let image = '';
            let driveId = '';
            if (file) {
                const upload = await uploadFile(file, { shared: true });
                image = `${GOOGLE_DRIVE}${upload}`;
                driveId = upload;
            }
            body = { ...body, status: 0, image: image, driveId: driveId };
            await categoryController.insert(body);
            return res.redirect('/admin/category');
        } else {
            if (file) {
                const upload = await uploadFile(file, { shared: true });
                let image = `${GOOGLE_DRIVE}${upload}`;
                body = { ...body, image: image, driveId: upload };
            }
            body = { ...body, status: 0 };
            await categoryController.update(result._id, body);
            return res.redirect('/admin/category');
        }
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
})

//http://localhost:8080/admin/:id/detail-category
router.get('/:id/detail-category', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await categoryController.getCategoryById(id);
        return res.render('detail_category', { title: 'Detail Category', data: category });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/:id/edit-category
router.post('/:id/edit-category', [upload.single('image'), authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        let { body, file, params } = req;
        if (file) {
            const result = await categoryController.getCategoryById(params.id);
            deleteFile(result.driveId);
            const upload = await uploadFile(file, { shared: true });
            let image = `${GOOGLE_DRIVE}${upload}`;
            body = { ...body, image: image, driveId: upload };
        }
        await categoryController.update(params.id, body);
        return res.redirect('/admin/category');
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/:id/delete-category
router.post('/:id/delete-category', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await categoryController.getCategoryById(id);
        deleteFile(category.driveId);
        await categoryController.delete(id);
        return res.redirect('/admin/category');
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});



//PRODUCT
//http://localhost:8080/admin/product
router.get('/product', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const data = await productController.getProduct();
        return res.render('list_product', { data: data });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

router.post('/product', [upload.single(''), authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const { searchValue } = req.body;
        if (searchValue.trim() == "") {
            return res.redirect('/admin/product');
        } else {
            const value = await productController.getProductBySearchValue(searchValue);
            return res.render('list_product', { title: 'Product', data: value, searchValue: searchValue });
        }
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/add-product
router.get('/add-product', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const data = await categoryController.getCategory();
        return res.render('add_product', { data: data });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/add-product
router.post('/add-product', [upload.array('multi-files'), authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        let { body, files } = req;
        const result = await productController.getProductByName(body.name);
        const amount = await amountController.getAmountByNumber(0);
        if (result == true) {
            res.redirect('/add-product');
        } else if (result == false) {
            let image = '';
            body = { ...body, amountID: amount._id, status: 0, avatarImage: image };
            await productController.insert(body);
            if (files[0]) {
                const product = await productController.findProductByName(body.name);
                let temp = {};
                for (let i = 0; i < files.length; i++) {
                    const upload = await uploadFile(files[i], { shared: true });
                    image = `${GOOGLE_DRIVE}${upload}`;
                    temp = { ...temp, productID: product._id, image: image, number: i, driveId: upload };
                    await PIController.insert(temp);
                }
                const image0 = await PIController.getPIByProductIDandNumber(product._id, 0);
                body = { ...body, avatarImage: image0[0].image };
                await productController.update(product._id, body);
            }
            res.redirect('/admin/product');
        } else {
            let image = '';
            body = { ...body, amountID: amount._id, status: 0, avatarImage: image };
            await productController.update(result._id, body);
            if (files[0]) {
                let temp = {};
                for (let i = 0; i < files.length; i++) {
                    const upload = await uploadFile(files[i], { shared: true });
                    image = `${GOOGLE_DRIVE}${upload}`;
                    temp = { ...temp, productID: result._id, image: image, number: i, driveId: upload };
                    await PIController.insert(temp);
                }
                const image0 = await PIController.getPIByProductIDandNumber(result._id, 0);
                body = { ...body, avatarImage: image0[0].image };
                await productController.update(result._id, body);
            }
            res.redirect('/admin/product');
        }
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/:id/detail-product
router.get('/:id/detail-product', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productController.getProductById(id);
        const category = await categoryController.getCategoryForProduct(product.categoryID._id);
        const productImage = await PIController.getPIByProductID(id);
        const amount = await amountController.getAmountForProduct(product.amountID._id);
        res.render('detail_product', { title: 'Detail Product', data: product, category: category, amount: amount, productImage: productImage });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/:id/edit-product
router.post('/:id/edit-product', [upload.array('multi-files'), authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        let { body, files, params } = req;
        if (files[0]) {
            let image;
            let temp = {};
            const amountImage = await PIController.getPIByProductID(params.id);
            if (body.checked) {
                let flagNumber = amountImage.length;
                for (let i = 0; i < files.length; i++) {
                    const upload = await uploadFile(files[i], { shared: true });
                    image = `${GOOGLE_DRIVE}${upload}`;
                    temp = { ...temp, productID: params.id, image: image, number: flagNumber, driveId: upload };
                    await PIController.insert(temp);
                    flagNumber++;
                }
            } else {
                for (let i = 0; i < files.length; i++) {
                    let pi = await PIController.getPIByProductIDandNumber(params.id, i);
                    if (pi == null) {
                        const upload = await uploadFile(files[i], { shared: true });
                        image = `${GOOGLE_DRIVE}${upload}`;
                        temp = { ...temp, productID: params.id, image: image, number: i, driveId: upload };
                        await PIController.insert(temp);
                    } else {
                        if (pi[0].driveId) {
                            deleteFile(pi[0].driveId);
                        }
                        const upload = await uploadFile(files[i], { shared: true });
                        image = `${GOOGLE_DRIVE}${upload}`;
                        temp = { ...temp, productID: params.id, image: image, number: i, driveId: upload };
                        await PIController.update(pi[0]._id, temp);
                    }
                }
                if (amountImage.length > files.length) {
                    for (let i = files.length; i < amountImage.length; i++) {
                        const delPI = await PIController.getPIByProductIDandNumber(params.id, i);
                        deleteFile(delPI[0].driveId);
                        await PIController.delete(delPI[0]._id);
                    }
                }
                const image0 = await PIController.getPIByProductIDandNumber(params.id, 0);
                body = { ...body, avatarImage: image0[0].image };
            }
        }
        await productController.update(params.id, body);
        return res.redirect('/admin/product');
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/:id/delete-product
router.post('/:id/delete-product', [authentication.checkLoginAdmin], async function (req, res, next) {
    try {
        const { id } = req.params;
        await productController.delete(id);
        const pi = await PIController.getPIByProductID(id);
        for (let i = 0; i < pi.length; i++) {
            deleteFile(pi[i].driveId);
            await PIController.delete(pi[i]._id);
        }
        return res.redirect('/admin/product');
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});


//ORDER
//http://localhost:8080/admin/order-all
router.get('/order-all', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const order = await orderController.getOrder();
        return res.render('list_order_all', { title: 'Order All', data: order });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

router.post('/order-all', [upload.single(''), authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const { searchValue } = req.body;
        if (searchValue.trim() == "") {
            return res.redirect('/admin/order-all');
        } else {
            const value = await orderController.getOrderBySearchValue(searchValue, false);
            return res.render('list_order_all', { title: 'Order All', data: value, searchValue: searchValue });
        }
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/order-processing
router.get('/order-processing', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const order = await orderController.getOrderProcessing();
        return res.render('list_order_processing', { title: 'Order Processing', data: order });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

router.post('/order-processing', [upload.single(''), authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const { searchValue } = req.body;
        if (searchValue.trim() == "") {
            return res.redirect('/admin/order-processing');
        } else {
            const value = await orderController.getOrderBySearchValue(searchValue, true);
            return res.render('list_order_processing', { title: 'Order Processing', data: value, searchValue: searchValue });
        }
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/:id/detail-order
router.get('/:id/detail-order', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const { params } = req;
        const order = await orderController.getOrderById(params.id);
        const status = await statusController.getStatusForOrder(order.statusID._id);
        const orderDetail = await orderDetailController.getOrderDetailByOrderID(params.id);
        return res.render('detail_order', { title: 'Detail Order', data: order, status: status, orderDetail: orderDetail });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});


//http://localhost:8080/admin/:id/edit-order
router.post('/:id/edit-order', [upload.single(''), authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const { body, params } = req;
        console.log(body);
        await orderController.update(params.id, body);
        const order = await orderController.getOrderProcessing();
        if (order.length == 0) {
            res.redirect('/admin/order-all');
        } else {
            res.redirect('/admin/order-processing');
        }
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/product-stat
router.get('/product-stat', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        res.render('stat_product', { title: 'Product Statistical' });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/product-stat-json
router.get('/product-stat-json', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const data = await orderDetailController.productStat();
        res.status(200).json(data);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});


module.exports = router;