/**
 * GET  /account/logout
 * Log out.
 */
module.exports.get = (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) console.log('Error : Failed to destroy the session during logout.', err);
        req.user = null;
        return res.redirect('/login');
    });
};