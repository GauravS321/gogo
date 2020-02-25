const validator = require('validator');

const { User } = require('.././../../src/web/models/users/user');
const Mailer = require('../../../helpers/mailer');

module.exports.resetPassword = (email, random, password, confirm_password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(random)) validationErrors.push({ msg: 'Please provide a username' })
            if (!validator.isEmail(email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
            if (!validator.isLength(password, { min: 6 })) validationErrors.push({ msg: 'Password must be at least 6 characters long' });
            if (password !== confirm_password) validationErrors.push({ msg: 'Passwords do not match' });

            if (validationErrors.length) {
                reject({
                    status: 401,
                    errors: validationErrors
                });
            }

            email = validator.normalizeEmail(email, { gmail_remove_dots: false });
            const user = await User.findOne({
                email,
                passwordResetToken: random
            })
                .where('passwordResetExpires').gt(Date.now())

            if (user) {
                user.local.password = password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;

                await user.save();
                await Mailer.sendPasswordChangedNotification(email, user.username);

                return resolve({
                    status: 200,
                    msg: "Your password has been successfully reset"
                })
            } else {
                return reject({
                    status: 401,
                    message: "Password reset token is invalid or has expired"
                });
            }
        } catch (error) {
            return reject({
                status: 500,
                message: error
            });
        }
    });
}