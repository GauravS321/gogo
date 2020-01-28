const mongoose = require('mongoose');

let newSchema = new mongoose.Schema({
    issuer: String,
    name: String,
    open: Boolean,
    reference: String,
    transactionid: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loyalty', newSchema);