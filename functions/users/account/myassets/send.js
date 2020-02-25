const validator = require('validator');

const APICall = require('../../../../helpers/request');
const { User } = require('../../../../src/web/models/users/user');

module.exports = (from_address, to_address, asset_name, quantity, details) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(from_address)) validationErrors.push({ msg: 'Please provide the address of the sender' })
            if (!validator.isLength(to_address)) validationErrors.push({ msg: 'Please provide the address of the reveiver' })
            if (!validator.isLength(asset_name)) validationErrors.push({ msg: 'Please provide an asset name' });
            if (!validator.isLength(details)) validationErrors.push({ msg: 'Please provide an asset description' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }
            if (quantity > 0) {
                if (quantity.length <= 11) {
                    if (validator.isEmail(to_address)) {
                        let { primechain_address } = await User.findOne({ email: to_address })
                        to_address = primechain_address;
                    }
                    else if (to_address.length <= 16) {
                        let { primechain_address } = await User.findOne({ mobile: to_address })
                        to_address = primechain_address;
                    }

                    let response = await APICall.httpPostMethod('send_asset', {
                        from_address,
                        to_address,
                        asset_name,
                        quantity: parseInt(quantity),
                        details
                    });

                    if (response.status === 200) {
                        return resolve({
                            status: 200,
                            success: true,
                            msg: response.tx_id
                        });
                    }
                    else {
                        return reject({
                            status: 404,
                            success: false,
                            message: response.message
                        });
                    }
                }
                else {
                    return reject({
                        status: 401,
                        message: "Asset quantity should not exceed 11 digits"
                    });
                }
            }
            else {
                return reject({
                    status: 401,
                    message: "Asset quantity should be greater than zero"
                });
            }
        } catch (error) {
            return reject({
                status: 500,
                error: error
            });
        }
    });
}