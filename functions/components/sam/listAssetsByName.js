const APICall = require('../../../helpers/request');

module.exports = (asset_name) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await APICall.httpPostMethod('asset_details', {
               asset_name
            });

            return resolve({
                status: 200,
                msg: response.response[0]
            });

        } catch (error) {
            return reject({
                status: 500,
                message: "Internal server error!!!"
            });
        }
    });
}