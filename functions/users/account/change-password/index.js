const validator = require('validator');

const { User, comparePassword } = require('../../../../src/web/models/users/user');
const Mailer = require('../../../../helpers/mailer');

module.exports.changePassword = (email, oldPassword, password, confirm_password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(oldPassword)) validationErrors.push({ msg: 'Please provide old password' });
            if (!validator.isLength(password, { min: 6 })) validationErrors.push({ msg: 'Password must be at least 6 characters long' });
            if (password !== confirm_password) validationErrors.push({ msg: 'Passwords do not match' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }

            const user = await User.findOne({ email });
            const isMatch = await comparePassword(email, oldPassword)

            if (isMatch) {
                user.local.password = password;

                await user.save();
                const issent = await Mailer.sendPasswordChangedNotification(email, user.username);
                if (issent){

                return resolve({
                    status: 200,
                    msg: "Password changed."
                });
            }
            else {
                return reject({
                    status: 401,
                    message: "Password has been reset."
                });

            }
            }
            else {
                return reject({
                    status: 401,
                    message: "Old password does not match."
                });
            }
        } catch (error) {
            return reject({
                status: 500,
                message: error.message
            });
        }
    });
}