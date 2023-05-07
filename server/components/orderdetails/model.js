const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderdetailSchema = new Schema({
    id: { type: ObjectId },
    orderID: { type: ObjectId, ref: 'order' },
    productID: { type: ObjectId, ref: 'product' },
    quantityPurchased: { type: Number },
    pricePurchased: { type: Number }
});

module.exports = mongoose.model('orderdetail', orderdetailSchema);