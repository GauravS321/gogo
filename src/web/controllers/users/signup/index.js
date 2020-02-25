const { create } = require('../../../../../functions/users/signup');
const { User } = require('../../../models/users/user')
const { create: createLoginDetails } = require('../../../../../functions/users/account/activity-logs');

// Get signup page
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.redirect('/users/account/my-profile', {
            username: req.user.username,
            email: req.user.email
        });
    }
    return res.render('users/signup');
}

/**
* POST /signup
* Create a new local account.
*/
module.exports.post = async (req, res) => {
    try {
        const { username, email, mobile = 'N/A', password, confirm_password } = req.body;
        await create(email, username, mobile, password, confirm_password);

        const user = await User.findOne({ "email": email.toLowerCase() });

        req.logIn(user, async (err) => {
            if (err) {
                req.flash('error_msg', 'Please login from here');
                return res.redirect('/login');
            }
        });

        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ip_arr = ip.split(':');
        ip = ip_arr[ip_arr.length - 1];
        let browser = req.headers['user-agent'];

        await createLoginDetails(email, ip, browser);

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