const validator = require('validator');
const APICall = require('../../../helpers/request');

module.exports = (key, trade_channel_name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(key)) validationErrors.push({ msg: 'Key is missing' });
            if (!validator.isLength(trade_channel_name)) validationErrors.push({ msg: 'Stream name is missing' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }

            const response = await APICall.httpPostMethod('list_trade_channel_items_by_key', {
                key,
                trade_channel_name
            });

            return resolve({
                status: 200,
                msg: response.response

            })
        } catch (error) {
            return reject({
                status: 401,
                error: error
            });
        }
    });
}