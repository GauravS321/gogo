const validator = require('validator');
const passport = require('passport');

/**
 * POST /login
 * Sign in using email and password.
 */
exports.authenticate = (req, res, email, password, next) => {
    return new Promise((resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isEmail(email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
            if (validator.isEmpty(password)) validationErrors.push({ msg: 'Password cannot be blank.' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }
            email = validator.normalizeEmail(email, { gmail_remove_dots: false });

            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true
            })(req, res, next);
        } catch (error) {
            return reject({
                status: 500,
                message: "Internal server error!!!"
            });
        }
    });
};
