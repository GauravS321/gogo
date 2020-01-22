const validator = require('validator');

<<<<<<< HEAD
=======
const Sam = require('../../../models/sam');

>>>>>>> master
const APICall = require('../../../helpers/request');

module.exports = (from_address, to_address, asset_name, quantity, details) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(to_address)) validationErrors.push({ msg: 'Please provide reveivers address' })
            if (!validator.isLength(asset_name)) validationErrors.push({ msg: 'Please provide a asset name' });
            if (!validator.isLength(details)) validationErrors.push({ msg: 'Please provide a asset description' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }
            if (quantity > 0) {
                if (quantity.length <= 11) {
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
                error: error
            });
        }
    });
}