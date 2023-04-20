const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const productImageSchema = new Schema({
    id: { type: ObjectId },
    productID: { type: ObjectId, ref: 'product' },
    name: { type: String },
    image: { type: String }
});

module.exports = mongoose.model('productimage', productImageSchema);