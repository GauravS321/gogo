// Login function call
const { authenticate } = require('../../../../../functions/users/login');
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
module.exports.post = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        await authenticate(req, res, next, email, password);

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