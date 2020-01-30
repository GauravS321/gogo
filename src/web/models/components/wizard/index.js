const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const newSchema = new Schema({
	uuid: String
    json: Object
}, { timestamps: true });

module.exports = mongoose.model('wizard', newSchema);
