const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const newSchema = new Schema({
	uuid: String,
    json: Object,
    permits: Array
}, { timestamps: true });

module.exports = mongoose.model('logistics', newSchema);