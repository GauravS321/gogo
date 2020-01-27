const validator = require('validator');

const APICall = require('../../../helpers/request');

module.exports = (from_address, to_address, name, quantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(name)) validationErrors.push({ msg: 'Please provide a asset name' })
            if (!validator.isLength(quantity)) validationErrors.push({ msg: 'Please provide a asset quantity' });
            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }
            if (quantity > 0) {
                if (quantity.length <= 11) {
                    const created_asset_info = await APICall.httpPostMethod('create_more_token', {
                        from_address,
                        to_address,
                        asset_name: name,
                        quantity: parseInt(quantity)
                    });

                    if (created_asset_info.status === 200) {
                        return resolve({
                            status: 200,
                            msg: created_asset_info.tx_id
                        });
                    }
                    else {
                        return reject({
                            status: 401,
                            message: created_asset_info.message
                        });
                    }
                }
                else {
                    return reject({
                        status: 401,
                        message: "Asset quantity should not exceed 11 character"
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
                message: error
            });
        }
    });
}