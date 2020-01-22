const validator = require('validator');

const User = require('../../../models/users');
const common = require('../../../helpers/common');
const Mail = require('../../../helpers/sendgrid');


exports.lostPassword = (email, url) => {
    return new Promise(async (resolve, reject) => {
        const validationErrors = [];

        if (!validator.isEmail(email)) validationErrors.push({ msg: 'Please enter a valid email address.' });

        if (validationErrors.length) {
            return reject({
                status: 401,
                errors: validationErrors
            });
        }

        email = validator.normalizeEmail(email, { gmail_remove_dots: false });

        try {
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
          await Mail.sendPasswordResetEmail(email, updatedUser.username, token, url);

            return resolve({
                status: 200,
                msg: `An e-mail has been sent to ${email} with further instructions`
            });

        } catch (error) {
            return reject({
                status: 500,
                error: error
            });
        }
    });
}