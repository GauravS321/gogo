const { changePassword } = require('../../../../../../functions/users/account/change-password')
/**
 * GET /web/account/change-password
 * User Change password.
 */
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.render('users/account/change-password', {
            username: req.user.username,
            email: req.user.email,
        });
    }
    return res.redirect('/login');
};

/**
 * POST /account/change-password
 * User Change password.
 */

module.exports.post = async (req, res) => {
    if (req.user && req.isAuthenticated()) {
        try {
            const { old_password, password, confirm_password } = req.body;

            await changePassword(req.user.email, old_password, password, confirm_password);

            req.flash("success_msg", "Your password changed successfully!!!");
            return res.redirect('/account/change-password');

        } catch (error) {
            if (error.errors) {
                req.flash('errors', error.errors);
                return res.redirect('/account/change-password');
            }
            else if (error.message) {
                req.flash('error_msg', error.message);
                return res.redirect('/account/change-password');
            }
            else {
                req.flash('error_msg', "Internal server error!!!");
                return res.redirect('/account/change-password');
            }
        }
    }
};