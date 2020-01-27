const mongoose = require('mongoose');

let activityLogSchema = new mongoose.Schema({
    email: { type: String, required: true },
    ip: String,
    browser: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);