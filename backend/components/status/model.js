const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const statusSchema = new Schema({
    id: { type: ObjectId },
    name: { type: String },
    number: { type: Number }
});

module.exports = mongoose.model('status', statusSchema);