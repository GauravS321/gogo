const validator = require('validator');

const User = require('../../../src/web/models/users/user');
const common = require('.././../../helpers/common');
const Mailer = require('../../../helpers/mailer');

module.exports.lostPassword = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isEmail(email)) validationErrors.push({ msg: 'Please enter a valid email address.' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }

            email = validator.normalizeEmail(email, { gmail_remove_dots: false });

            const token = await common.generateRandomString(16);
            const updatedUser = await User.findOneAndUpdate(
                { email },
                {
                    passwordResetToken: token,
                    passwordResetExpires: Date.now() + 3600000 // 1 hour
                },
                { new: true }
            );

            const userNotFound = !updatedUser;

            if (userNotFound) {
                return reject({
                    status: 401,
                    error: `Unable to find user with this email ${email}`
                });
            }
            await Mailer.sendPasswordResetEmail(email, updatedUser.username, token);

            return resolve({
                status: 200,
                msg: `An e-mail has been sent to ${email} with further instructions`
            });

        } catch (error) {
            return reject({
                status: 500,
                message: error
            });
        }
    });
}