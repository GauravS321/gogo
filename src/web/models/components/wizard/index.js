const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const newSchema = new Schema({
    json: Object
}, { timestamps: true });

module.exports = mongoose.model('wizard', newSchema);
