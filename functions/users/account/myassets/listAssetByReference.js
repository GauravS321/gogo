const APICall = require('../../../../helpers/request');

module.exports = (primechain_address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await APICall.httpPostMethod('asset_details', {
                primechain_address
            });

            return resolve({
                status: 200,
                msg: response.response
            });

        } catch (error) {
            return reject({
                status: 500,
                message: "Blockchain has reported an error"
            });
        }
    });
}