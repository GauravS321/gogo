const APICall = require('../../../helpers/request');

module.exports = (primechain_address, data, url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const save_to_great = (url === "create-save-signature") ? true : false;

            const response = await APICall.httpPostMethod('create_signature', {
                primechain_address,
                data,
                save_to_great
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
