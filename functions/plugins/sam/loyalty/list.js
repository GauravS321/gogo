const APICall = require('../../../../helpers/request');

module.exports = (primechain_address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await APICall.httpPostMethod('assets_held_by_entity', {
                primechain_address
            });

            return resolve({
                status: 200,
                msg: response.response
            });

        } catch (error) {
            return reject({
                status: 500,
                message: "Internal server error!!!"
            });
        }
    });
}