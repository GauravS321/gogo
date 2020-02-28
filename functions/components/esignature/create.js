const APICall = require('../../../helpers/request');
const crypto = require('crypto');

module.exports = (primechain_address, data, url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const save_to_great = (url === "create-save") ? true : false;

            const newdata = (save_to_great) ? crypto.createHash('sha512').update(JSON.stringify(data)).digest('base64') : data

            const response = await APICall.httpPostMethod('create_signature', {
                primechain_address,
                data: newdata,
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
                    message: response.message
                });
            }
        } catch (error) {
            return reject({
                status: 500,
                message: error
            });
        }
    });
}
