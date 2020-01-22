const { signup } = require('./signup');
const { lostPassword } = require('./lost_password');
const { resetPassword } = require('./reset_password');
const getActivityLogs = require('./activity_logs');
const { changePassword } = require('./change_password');

module.exports = {
    signup,
    lostPassword,
    resetPassword,
    getActivityLogs,
    changePassword
};