const validator = require('validator');

const { User } = require('../../../src/web/models/users/user');
const APICall = require('./../../../helpers/request');

module.exports.create = (email, username, mobile, password, confirm_password) => {
    return new Promise(async (resolve, reject) => {
        const validationErrors = [];

        if (!validator.isLength(username)) validationErrors.push({ msg: 'Please provide a username' })
        if (!validator.isLength(mobile)) validationErrors.push({ msg: 'Please provide a mobile' })
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
        try {
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
                "permission": "receive"
            });

            const newUser = new User({
                "method": "local",
                "username": username,
                "email": email,
                "local.password": password,
                "role": "customer",
                "mobile": mobile,
                "primechain_address": primechain_address.primechain_address
            });

            await newUser.save();

            return resolve({
                status: 200,
                message: "Account created!!!"
            });
        } catch (error) {
            return reject({
                status: 500,
                message: "Internal server error!!!"
            });
        }
    });
}