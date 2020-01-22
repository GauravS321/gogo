const { read } = require('../../../../../functions/users/account/activity_logs');
/**
 * GET /web/account/activity-logs
 * User Activity logs.
 */
exports.get = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            let activityLogArr = [];
            const response = await read(req.user.email);

            response.msg.forEach(log => {
                activityLogArr.push({
                    ip: log.ip,
                    browser: log.browser,
                    timestamp: log.timestamp
                });
            });

            return res.render('users/account/activity-logs',
                {
                    activityLogArr,
                    username: req.user.username,
                    email: req.user.email,
                });

        } catch (error) {
            console.log(error);

            return res.render('account/activity_logs');
        }
    }
    return res.redirect('/login');
};