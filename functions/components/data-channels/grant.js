const validator = require('validator');
const APICall = require('../../../helpers/request');

module.exports = (trade_channel_writer, trade_channel_name, trade_channel_creator) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(trade_channel_writer)) validationErrors.push({ msg: 'Primechain address is missing' })
            if (!validator.isLength(trade_channel_name)) validationErrors.push({ msg: 'Stream name is missing' });
            if (!validator.isLength(trade_channel_creator)) validationErrors.push({ msg: 'Stream create address is missing' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }

            let response = await APICall.httpPostMethod('grant_write_permission_to_trade_channel', {
                trade_channel_writer,
                trade_channel_name,
                trade_channel_creator
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