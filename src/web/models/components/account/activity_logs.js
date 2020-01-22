const mongoose = require('mongoose');

let activityLogSchema = new mongoose.Schema({
    email: { type: String, required: true },
    ip: String,
    browser: String,
    timestamp: { type: Date, default: Date.now }
});

/**
 * Save user activites
 */
activityLogSchema.pre('save', function save(next) {
    next();
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;