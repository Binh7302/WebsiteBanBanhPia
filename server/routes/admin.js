var express = require('express');
var router = express.Router();

require('dotenv').config;
const categoryController = require('../components/categories/controller');
const productController = require('../components/products/controller');
const PIController = require('../components/productimages/controller');
const orderController = require('../components/orders/controller');
const orderDetailController = require('../components/orderdetails/controller');
const statusController = require('../components/status/controller');
const jwt = require('jsonwebtoken');
const authentication = require('../middleware/authentication');
const upload = require('../middleware/upload');
const clientRedis = require('../middleware/redis');
const passport = require("passport");
require("../middleware/passport")(passport);
const { uploadFile, deleteFile } = require('../middleware/drive');
const DOMAIN = process.env.IP + ':' + process.env.PORT;
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
            clientRedis.set(process.env.TOKEN_LOGIN, 0);
            clientRedis.get(process.env.TOKEN_LOGIN, async (err, data) => {
                clientRedis.set(process.env.TOKEN_LOGIN, parseInt(data) + 1);
                const token = jwt.sign({ user: req.user }, process.env.JWT_ADMIN_KEY, { expiresIn: '1h' });
                clientRedis.setex(parseInt(data) + 1, 3600, token);
            });
            req.session.tokenClient = true;
            //vao trang chu
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
            if (!err) {
                res.clearCookie(process.env.SESS_NAME);
                clientRedis.del(clientRedis.get(process.env.TOKEN_LOGIN));
                clientRedis.del(process.env.TOKEN_LOGIN);
                return res.status(200).send(true);
            } else {
                return res.status(404).send(err.message);
            }
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
        return res.status(200).json(data);
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
            return res.status(200).send(false);
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
            return res.status(200).send(true);
        } else {
            if (file) {
                deleteFile(result.driveId);
                const upload = await uploadFile(file, { shared: true });
                let image = `${GOOGLE_DRIVE}${upload}`;
                body = { ...body, image: image, driveId: upload };
            }
            body = { ...body, status: 0 };
            await categoryController.update(result._id, body);
            return res.status(200).send(true);
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
        return res.status(200).json(category);
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
        return res.status(200).send(true);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/:id/delete-category
router.post('/:id/delete-category', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const { id } = req.params;
        await categoryController.delete(id);
        // await categoryController.deleteDev(id);
        return res.status(200).send(true);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});



//PRODUCT
//http://localhost:8080/admin/product
router.get('/product', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const data = await productController.getProduct();
        return res.render('product', { data: data });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/add-product
router.get('/add-product', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const data = await categoryController.getCategory();
        res.status(200).json(data);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/add-product
router.post('/add-product', [upload.array('multi-files'), authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        let { body, files } = req;
        const result = await productController.getProductByName(body.name);
        if (result == true) {
            res.status(200).send(false);
        } else if (result == false) {
            let image = '';
            body = { ...body, status: 0, avatarImage: image };
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
            return res.status(200).send(true);
        } else {
            let image = '';
            body = { ...body, status: 0, avatarImage: image };
            await productController.update(result._id, body);
            if (files[0]) {
                let temp = {};
                for (let i = 0; i < files.length; i++) {
                    let pi = await PIController.getPIByProductIDandNumber(result._id, i);
                    if (pi == null) {
                        const upload = await uploadFile(files[i], { shared: true });
                        image = `${GOOGLE_DRIVE}${upload}`;
                        temp = { ...temp, productID: result._id, image: image, number: i, driveId: upload };
                        await PIController.insert(temp);
                    } else {
                        deleteFile(pi[0].driveId);
                        const upload = await uploadFile(files[i], { shared: true });
                        image = `${GOOGLE_DRIVE}${upload}`;
                        temp = { ...temp, productID: result._id, image: image, number: i, driveId: upload };
                        await PIController.update(pi[0]._id, temp);
                    }
                }
                const image0 = await PIController.getPIByProductIDandNumber(result._id, 0);
                body = { ...body, avatarImage: image0[0].image };
                await productController.update(result._id, body);
            }
            return res.status(200).send(true);
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
        const category = await categoryController.getCategoryForProduct(product.categoryID);
        const productImage = await PIController.getPIByProductID(id);
        res.status(200).json({ product: product, category: category, productImage: productImage });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/:id/edit-product
router.post('/:id/edit-product', [upload.array('multi-files'), authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        let { body, files, params } = req;
        if (files[0]) {
            let temp = {};
            let image;
            for (let i = 0; i < files.length; i++) {
                let pi = await PIController.getPIByProductIDandNumber(params.id, i);
                if (pi == null) {
                    const upload = await uploadFile(files[i], { shared: true });
                    image = `${GOOGLE_DRIVE}${upload}`;
                    temp = { ...temp, productID: params.id, image: image, number: i, driveId: upload };
                    await PIController.insert(temp);
                } else {
                    deleteFile(pi[0].driveId);
                    const upload = await uploadFile(files[i], { shared: true });
                    image = `${GOOGLE_DRIVE}${upload}`;
                    temp = { ...temp, productID: params.id, image: image, number: i, driveId: upload };
                    await PIController.update(pi[0]._id, temp);
                }
            }
            const image0 = await PIController.getPIByProductIDandNumber(params.id, 0);
            body = { ...body, avatarImage: image0[0].image };
            await productController.update(params.id, body);
        }
        return res.status(200).send(true);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/:id/delete-product
router.post('/:id/delete-product', [authentication.checkLoginAdmin], async function (req, res, next) {
    try {
        const { id } = req.params;
        await productController.delete(id);
        // await productController.deleteDev(id);
        return res.status(200).send(true);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});


//ORDER
//http://localhost:8080/admin/order-all
router.get('/order-all', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const order = await orderController.getOrder();
        return res.status(200).json(order);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});


//http://localhost:8080/admin/order-processing
router.get('/order-processing', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const order = await orderController.getOrderProcessing();
        return res.status(200).json(order);
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
        return res.status(200).json({ order: order, status: status, orderDetail: orderDetail });
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});


//http://localhost:8080/admin/:id/edit-order
router.post('/:id/edit-order', [upload.single(''), authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const { body, params } = req;
        await orderController.update(params.id, body);
        const order = await orderController.getOrderProcessing();
        if (order.length == 0) {
            //sang trang tat ca don hang
            res.status(200).send(true);
        } else {
            //sang trang don hang dang xu ly
            res.status(200).send(false);
        }
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/product-stat
router.get('/product-stat', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const data = await orderDetailController.productStat();
        res.status(200).json(data);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/status
router.get('/status', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const data = await statusController.getStatus();
        res.status(200).json(data);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});

//http://localhost:8080/admin/product-image
router.get('/product-image', [authentication.checkLoginAdmin], async (req, res, next) => {
    try {
        const product = await productController.getProductByName('Bánh pía trà xanh');
        const data = await PIController.getPIByProductID(product._id);
        res.status(200).json(data);
    } catch (err) {
        return res.status(404).send({ message: err.message });
    }
});


module.exports = router;