const { lostPassword } = require('../../../../../functions/users/lost-password');

module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.redirect('/account/my-profile');
    }
    return res.render('users/lost-password');
}

module.exports.post = async (req, res) => {
    try {
        const { email } = req.body;
        await lostPassword(email);

        req.flash('success_msg', response.msg);
        return res.redirect('/login');
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