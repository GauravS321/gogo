const APICall = require('../../../helpers/request');

module.exports = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { status, response, message } = await APICall.httpPostMethod('get_from_great', {
                data: data
            });

            if (status === 200) {
                return resolve({
                    status: 200,
                    msg: response[0]
                });
            }
            else {
                return reject({
                    status: 500,
                    message
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
