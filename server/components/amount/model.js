const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const amountSchema = new Schema({
    id: { type: ObjectId },
    name: { type: String },
    number: { type: Number }
});

module.exports = mongoose.model('amount', amountSchema);