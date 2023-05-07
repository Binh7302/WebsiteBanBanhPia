const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const categorySchema = new Schema({
    id: { type: ObjectId },
    name: { type: String },
    image: { type: String },
    status: { type: Number },
    driveId: { type: String }
});

module.exports = mongoose.model('category', categorySchema);