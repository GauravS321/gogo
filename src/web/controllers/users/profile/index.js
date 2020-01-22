/**
 * GET /web/account/my-profile
 * User profile.
 */
module.exports.get = (req, res) => {    
    if (req.user && req.isAuthenticated()) {
        return res.render('users/account/my-profile', {
            username: req.user.username,
            email: req.user.email,
            primechain_address: req.user.primechain_address
        });
    }
    return res.redirect('/login');
};