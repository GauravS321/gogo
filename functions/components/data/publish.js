const validator = require('validator');
const APICall = require('../../../helpers/request');

module.exports = (primechain_address, data, stream_name, key) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(primechain_address)) validationErrors.push({ msg: 'Primechain address is missing' })
            if (!validator.isLength(key)) validationErrors.push({ msg: 'Key is missing' })
            // if (!validator.isLength(data)) validationErrors.push({ msg: 'Data is missing' });
            if (!validator.isLength(stream_name)) validationErrors.push({ msg: 'Stream name is missing' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }

            const response = await APICall.httpPostMethod('write_to_stream', {
                primechain_address_stream_writer: primechain_address,
                key,
                value: data,
                stream: stream_name
            });

            return resolve({
                status: 200,
                msg: response.response

            })
        } catch (error) {
            return reject({
                status: 401,
                message: error
            })
        }
    });
}