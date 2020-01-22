const APICall = require('../../../helpers/request');


module.exports = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await APICall.httpGetMethod('list_data_streams');

            if (response.status === 200) {
                return resolve({
                    status: 200,
                    msg: response.stream_details
                });
            }
            else {
                return reject({
                    status: 401,
                    message: response.message
                });
            }
        } catch (error) {
            return reject({
                status: 500,
                error: error
            });
        }
    });
}