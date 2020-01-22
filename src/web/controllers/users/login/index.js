const { authenticate } = require('../../../../../functions/users/login');
const ActivityLog = require('../../../../..//src/web/models/users/activity-logs');
/**
 * GET /login
 * Login page.
 */
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.redirect('/account/my-profile');
    }
    return res.render('users/login');
};

/**
 * POST /login
 * Sign in using email and password.
 */
module.exports.post = async (req, res) => {
    try {
        const { email, password } = req.body;

        await authenticate(req, res, email, password);
        
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ip_arr = ip.split(':');
        ip = ip_arr[ip_arr.length - 1];
        let browser = req.headers['user-agent'];

        await ActivityLog.create(email, ip, browser);

        return res.redirect('/account/my-profile');

    } catch (error) {
        if (error.errors) {
            req.flash('errors', error.errors);
            return res.redirect('/login');
        }
        else if (error.message) {
            req.flash('error_msg', error.message);
            return res.redirect('/login');
        }
        else {
            req.flash('error_msg', "Internal server error!!!");
            return res.redirect('/login');
        }
    }
};