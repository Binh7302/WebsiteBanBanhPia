var express = require('express');
var router = express.Router();

require('dotenv').config;
const productController = require('../components/products/controller');
const PIController = require('../components/productimages/controller');
const orderController = require('../components/orders/controller');
const orderDetailController = require('../components/orderdetails/controller');
const statusController = require('../components/status/controller');
const upload = require('../middleware/upload');

//http://localhost:8080/product
router.get('/product', async (req, res, next) => {
    try {
        const data = await productController.getProduct();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(404).send(err);
    }
});

//http://localhost:8080/:id/detail-product
router.get('/:id/detail-product', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productController.getProductById(id);
        const productImage = await PIController.getPIByProductID(id);
        return res.status(200).json({ product: product, productImage: productImage });
    } catch (err) {
        return res.status(404).send(err.message);
    }
});

//http://localhost:8080/create-order
router.post('/create-order', async (req, res, next) => {
    try {
        const { body } = req;
        if (body.Cart.length) {
            //check product
            for (let i = 0; i < body.Cart.length; i++) {
                const product = await productController.getProductById(body.Cart[i].id);
                if (product && product.status === 0) {
                    if (product.amountID.number != 0) {
                        return res.status(200).send(false);
                    }
                } else {
                    return res.status(200).send(false);
                }
            }
            //create order
            let flagTotal = 0;
            for (let i = 0; i < body.Cart.length; i++) {
                flagTotal += body.Cart[i].price * body.Cart[i].amount;
            }
            const status = await statusController.getStatusByNumber(0);
            const date = new Date();
            let orderBody = {
                statusID: status._id, createdAt: date, statusRevenue: 0,
                total: flagTotal, name: body.Customer.name,
                phonenumber: body.Customer.phone, address: body.Customer.address
            };
            await orderController.insert(orderBody);
            //create cart detail
            const order = await orderController.getOrderByInfo(body.Customer.name, body.Customer.phone, body.Customer.address, date);
            let temp = { orderID: order[0]._id };
            for (let i = 0; i < body.Cart.length; i++) {
                temp = {
                    ...temp, productID: body.Cart[i].id,
                    quantityPurchased: body.Cart[i].amount,
                    pricePurchased: body.Cart[i].price
                };
                await orderDetailController.insert(temp);
            }
            return res.status(200).send(true);
        } else {
            return res.status(200).send(false);
        }
    } catch (err) {
        return res.status(404).send(err.message);
    }
});


module.exports = router;