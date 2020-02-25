/**
 * GET /login
 * Login page.
 */
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.redirect('/account/my-profile', {
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        });
    }
    return res.render('users/login');
};