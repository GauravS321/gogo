const { create } = require('../../../../../functions/users/signup');

// Get signup page
module.exports.get = (req, res) => {
    if (req.user && req.isAuthenticated()) {
        return res.redirect('/users/account/my-profile');
    }
    return res.render('users/signup');
}

/**
* POST /signup
* Create a new local account.
*/
module.exports.post = async (req, res) => {
    try {
        const { username, email, mobile, password, confirm_password } = req.body;        
        let response = await create(email, username, mobile, password, confirm_password);

        req.flash('success_msg', response.msg);
        return res.redirect('/login');
    } catch (error) {
        if (error.errors) {
            req.flash('errors', error.errors);
            return res.redirect('/login');
        }
        else if (error.message) {
            req.flash('error_msg', error.error);
            return res.redirect('/login');
        }
        else {
            req.flash('error_msg', "Internal server error!!!");
            return res.redirect('/login');
        }
    }
};