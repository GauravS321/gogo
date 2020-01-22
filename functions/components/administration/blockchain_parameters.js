const APICall = require('../../../helpers/request');

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let blockchainParamtersArr = [];

            let blockchain_parameters = await APICall.httpGetMethod('blockchain_params');
            
            Object.keys(blockchain_parameters['blockchain_params']).map((_key) => {
                let displayName = _key.toLowerCase().split('-').map((word) => {
                    return (word.charAt(0).toUpperCase() + word.slice(1));
                }).join(' ');

                blockchainParamtersArr.push({ key: _key, displayName: displayName, value: blockchain_parameters['blockchain_params'][_key] });
            });

            return resolve({
                status: 200,
                msg: blockchainParamtersArr
            });
        } catch (error) {
            return reject({
                status: 500,
                error: error
            });
        }
    });
}