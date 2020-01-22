const validator = require('validator');

const User = require('../../../src/web/models/users/user');
const APICall = require('../../../helpers/request');

module.exports.create = (email, username, password, confirm_password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(username)) validationErrors.push({ msg: 'Please provide a username' })
            if (!validator.isEmail(email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
            if (!validator.isLength(password, { min: 6 })) validationErrors.push({ msg: 'Password must be at least 6 characters long' });
            if (password !== confirm_password) validationErrors.push({ msg: 'Passwords do not match' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }

            email = validator.normalizeEmail(email, { gmail_remove_dots: false });

            const user = await User.findOne({ email });

            if (user) {
                return reject({
                    status: 401,
                    message: 'Account with that email address already exists.'
                });
            }

            const { primechain_address } = await APICall.httpPostMethod('create_entity', {
                "external_key_management": false,
                "generate_rsa_keys": false
            });

            await APICall.httpPostMethod('manage_permissions', {
                "action": "grant",
                "primechain_address": primechain_address.primechain_address,
                "permission": "send,receive,issue"
            });

            const newUser = new User({
                username,
                email,
                password,
                primechain_address: primechain_address.primechain_address
            });

            await newUser.save();

            return resolve({
                status: 200,
                msg: "Account created!!!"
            });
        } catch (error) {
            return reject({
                status: 500,
                message: error
            });
        }
    });
}