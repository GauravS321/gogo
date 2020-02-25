const { User } = require('../../../models/users/user');
const { resetPassword } = require('../../../../../functions/users/reset-password');

// User reset password
module.exports.get = async (req, res) => {
    if (Object.keys(req.query).length == 0) {
        req.flash('error_msg', 'Incorrect email / password.');
        return res.redirect('/login');
    }
    else {
        try {
            const { email_address, random } = req.query;
            const user = await User.findOne({ email: email_address, passwordResetToken: random })
                .where('passwordResetExpires').gt(Date.now());

            if (user) {
                return res.render('users/reset-password', { email_address, random });
            } else {
                req.flash('error_msg', `Incorrect email / password.`);
                return res.redirect('/login');
            }
        } catch (error) {
            req.flash('error_msg', 'Internal server error');
            return res.redirect('/login');
        }
    }
}

module.exports.post = async (req, res) => {
    try {
        const { email, random, password, confirm_password } = req.body;
        const response = await resetPassword(email, random, password, confirm_password);

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
}