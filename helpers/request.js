const request = require('request');

const encodedData = Buffer.from(process.env.PRIMECHAIN_USERNAME + ':' + process.env.PRIMECHAIN_PASSWORD).toString('base64');
const authorizationHeader = 'Basic ' + encodedData;


exports.httpGetMethod = (methodName) => {
    return new Promise((resolve, reject) => {
        request.get({
            uri: `http://${process.env.PRIMECHAIN_API_URN}:${process.env.PRIMECHAIN_API_PORT}/api/v1/${methodName}`,
            json: true,
            headers: {
                'Authorization': authorizationHeader
            }
        }, (error, response, body) => {
            if (error)
                reject(error);
            try {
                resolve(body)
            } catch (e) {
                reject(e)
            }
        })
    });
};

exports.httpPostMethod = (methodName, body) => {
    return new Promise((resolve, reject) => {
        request.post({
            uri: `http://${process.env.PRIMECHAIN_API_URN}:${process.env.PRIMECHAIN_API_PORT}/api/v1/${methodName}`,
            json: true,
            headers: {
                'Authorization': authorizationHeader,
                'Content-Type': 'application/json'
            },
            body: body
        }, (error, response, body) => {
            if (error)
                reject(error);
            try {
                resolve(body);
            } catch (e) {
                reject(e);
            }
        });
    });
}