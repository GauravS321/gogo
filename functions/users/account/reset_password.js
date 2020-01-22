const validator = require('validator');

const User = require('../../models/users');
const Mail = require('../../helpers/sendgrid');

exports.resetPassword = (email, random, password, confirm_password, url) => {
    return new Promise(async (resolve, reject) => {
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

        try {
            const user = await User.findOne({
                email,
                passwordResetToken: random
            })
                .where('passwordResetExpires').gt(Date.now())

            if (user) {
                user.password = password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;

                await user.save();

                await Mail.sendPasswordChangedNotification(email, user.username, url);

                return resolve({
                    status: 200,
                    msg: "Your password has been successfully reset"
                })
            } else {
                return reject({
                    status: 401,
                    error: "Password reset token is invalid or has expired"
                });
            }
        } catch (error) {
            return reject({
                status: 401,
                error: error
            });
        }
    });
}