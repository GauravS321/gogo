const APICall = require('../../helpers/request');

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let blockchainInformationArr = [];

            let blockchain_information = await APICall.httpGetMethod('blockchain_info');
            
            Object.keys(blockchain_information['blockchain_info']).map((_key) => {
                let displayName = _key.toLowerCase().split('-').map((word) => {
                    return (word.charAt(0).toUpperCase() + word.slice(1));
                }).join(' ');

                blockchainInformationArr.push({ key: _key, displayName: displayName, value: blockchain_information['blockchain_info'][_key] });
            });

            return resolve({
                status: 200,
                msg: blockchainInformationArr
            });
        } catch (error) {
            return reject({
                status: 500,
                error: error
            });
        }
    });
}