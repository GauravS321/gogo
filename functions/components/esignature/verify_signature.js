const APICall = require('../../../helpers/request');

module.exports = (primechain_address, data, signature) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { status, response, message } = await APICall.httpPostMethod('verify_signature', {
                primechain_address,
                data,
                signature
            });

            if (status === 200) {
                return resolve({
                    status: 200,
                    msg: response
                });
            }
            else {
                return reject({
                    status: 500,
                    error: message
                });
            }
        } catch (error) {
            return reject({
                status: 500,
                error
            });
        }
    });
}
