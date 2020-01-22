const validator = require('validator');

const APICall = require('../../../helpers/request');

module.exports = (from_address, to_address, name, quantity, unit, open, description) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(name)) validationErrors.push({ msg: 'Please provide a asset name' })
            if (!validator.isLength(quantity)) validationErrors.push({ msg: 'Please provide a asset quantity' });
            if (!validator.isLength(unit)) validationErrors.push({ msg: 'Please provide a asset unit' });
            if (!validator.isLength(open)) validationErrors.push({ msg: 'Please provide a asset open' });
            if (!validator.isLength(description)) validationErrors.push({ msg: 'Please provide a asset description' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }
            if (quantity > 0) {
                if (quantity.length <= 11) {
                    open = (open === 'true') ? true : false;
                    const created_asset_info = await APICall.httpPostMethod('create_token', {
                        from_address,
                        to_address,
                        asset: { name, open },
                        unit: 1,
                        quantity,
                        details: description
                    });

                    if (created_asset_info.status === 200) {
                        let sam = new Sam({
                            name,
                            description,
                            asset_ref: created_asset_info["asset_ref"],
                            txid: created_asset_info["tx_id"]
                        });

                        await sam.save();
                        
                        return resolve({
                            status: 200,
                            msg: {
                                name,
                                quantity,
                                open,
                                unit,
                                description,
                                asset_ref: created_asset_info["asset_ref"],
                                txid: created_asset_info["tx_id"]
                            }
                        });
                    }
                    else {
                        return reject({
                            status: 401,
                            message: "Unable to create asset"
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