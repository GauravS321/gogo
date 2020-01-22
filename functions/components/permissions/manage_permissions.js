const APICall = require('../../../helpers/request');

module.exports = (action, primechain_address, permission) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await APICall.httpPostMethod('manage_permissions', {
                "action": action,
                "primechain_address": primechain_address,
                "permission": permission
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
