/**
 * GET /login
 * Login page.
 */
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.redirect('/account/my-profile');
    }
    else {
        return res.render('users/login');
    }
};