const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const orderSchema = new Schema({
    id: { type: ObjectId },
    statusID: { type: ObjectId, ref: 'status' },
    createdAt: { type: Date },
    total: { type: Number },
    name: { type: String },
    phonenumber: { type: String },
    address: { type: String }
});

module.exports = mongoose.model('order', orderSchema);