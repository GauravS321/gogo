const validator = require('validator');
const APICall = require('../../../helpers/request');


module.exports = (primechain_address, trade_channel_name, trade_channel_details, open) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(primechain_address)) validationErrors.push({ msg: 'Primechain address is missing' })
            if (!validator.isLength(trade_channel_name)) validationErrors.push({ msg: 'Stream name is missing' });
            if (!validator.isLength(trade_channel_details)) validationErrors.push({ msg: 'Stream details are missing' });
            if (!validator.isLength(open)) validationErrors.push({ msg: 'Stream open type is missing' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }

            open = (open === 'true') ? true : false;

            let response = await APICall.httpPostMethod('create_trade_channel', {
                primechain_address,
                trade_channel_name,
                trade_channel_details,
                open: open
            });

            if (response.status === 200) {
                return resolve({
                    status: 200,
                    msg: response.tx_id
                });
            }
            else {
                return reject({
                    status: 401,
                    message: response.message
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