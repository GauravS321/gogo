const validator = require('validator');
const APICall = require('../../../helpers/request');

module.exports = (primechain_address, data, stream_name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const validationErrors = [];

            if (!validator.isLength(primechain_address)) validationErrors.push({ msg: 'Primechain address is missing' })
            if (!validator.isLength(data)) validationErrors.push({ msg: 'Data is missing' });
            if (!validator.isLength(stream_name)) validationErrors.push({ msg: 'Stream name is missing' });

            if (validationErrors.length) {
                return reject({
                    status: 401,
                    errors: validationErrors
                });
            }

            const response = await APICall.httpPostMethod('encrypt_sign_store_data', {
                primechain_address,
                data,
                stream_name
            });
          
            return resolve({
                status: 200,
                msg: response.response

            })
        } catch (error) {
            return reject({
                status: 401,
                error: error
            })
        }
    })
}