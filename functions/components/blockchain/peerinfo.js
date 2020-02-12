const APICall = require('../../../helpers/request');

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let peerinfo = await APICall.httpGetMethod('peer_info');

            return resolve({
                status: 200,
                msg: peerinfo.peerinfo
            });
        } catch (error) {
            return reject({
                status: 500,
                error: error
            });
        }
    });
}