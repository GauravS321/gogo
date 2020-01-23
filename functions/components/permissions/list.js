const APICall = require('../../../helpers/request');

module.exports = (primechain_address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await APICall.httpPostMethod('listpermissions', {
                primechain_address
            });

            if (response.status === 200) {
                return resolve({
                    status: 200,
                    msg: response
                });
            }
            else {
                return reject({
                    status: 500,
                    error: response.message
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
