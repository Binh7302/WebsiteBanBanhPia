const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const productSchema = new Schema({
    id: { type: ObjectId },
    categoryID: { type: ObjectId, ref: 'category' },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    description: { type: String },
    status: { type: Number },
    weigth: { type: Number },
    ingredient: { type: String },
    productManual: { type: String },
    preserve: { type: String },
    expirationDate: { type: String },
    brand: { type: String },
    avatarImage: { type: String }
});

module.exports = mongoose.model('product', productSchema);