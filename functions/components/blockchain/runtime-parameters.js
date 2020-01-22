const APICall = require('../../../helpers/request');

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let runtimeParamtersArr = [];

            let runtime_parameters = await APICall.httpGetMethod('runtime_params');
            
            Object.keys(runtime_parameters['runtime_params']).map((_key) => {
                let displayName = _key.toLowerCase().split('-').map((word) => {
                    return (word.charAt(0).toUpperCase() + word.slice(1));
                }).join(' ');

                runtimeParamtersArr.push({ key: _key, displayName: displayName, value: runtime_parameters['runtime_params'][_key] });
            });

            return resolve({
                status: 200,
                msg: runtimeParamtersArr
            });
        } catch (error) {
            return reject({
                status: 500,
                error: error
            });
        }
    });
}