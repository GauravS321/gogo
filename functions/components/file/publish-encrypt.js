const APICall = require('../../../helpers/request');

module.exports = (primechain_address, file, stream_name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await APICall.httpPostMethod('encrypt_sign_store_file', {
                primechain_address,
                file,
                stream_name
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