'use strict';

var pool = require('../models/api_management');
const request = require('request');
const err_code = require('../error-code/error');


var checkAuthorization = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            if (req.headers['authorization'])
                resolve(true);
            else
                return reject();
        } catch (error) {
            reject(error);
        }
    });
};

var checkMimeType = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            if (req.method === 'GET')
                resolve(true);
            else if (req.method === 'POST' && req.headers['content-type'])
                resolve(true);
            else
                return reject();

        } catch (error) {
            reject(error);
        }
    });
};

module.exports.validateAPIKey = (req, res) => {
    return new Promise((resolve, reject) => {
        let apikey = req.headers['authorization'];

        pool.query('SELECT * FROM user_authentication WHERE api_key = ?;', [apikey], (error, results) => {
            if (results.length == 1)
                resolve(true);
            else
                return reject(error);
        })
    });
};

module.exports.checkToken = (req, res, next) => {
    checkMimeType(req, res)
        .then(() => {
            checkAuthorization(req, res)
                .then(() => {
                    next();
                })
                .catch(err => {
                    res
                        .status(401)
                        .json({
                            status: 401,
                            message: err_code.errorcode["13031"]
                        });
                });
        })
        .catch(err => {
            res
                .status(401)
                .json({
                    status: 401,
                    message: err_code.errorcode["13032"]
                });
        });
};

module.exports.validateEmail = (email_id) => {
    return new Promise((resolve, reject) => {
        let regEx = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

        try {
            if (regEx.test(email_id) === true)
                resolve(true);
            else
                resolve(false);
        } catch (error) {
            reject(error)
        }
    });
};

module.exports.emailexist = (email_id) => {
    return new Promise((resolve, reject) => {
        // https://api.trumail.io/v2/lookups/JSON?email=abc@gmail.com

        let options = {
            url: 'https://api.trumail.io/v2/lookups/JSON?email=' + email_id,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        request(options, (error, response, body) => {
            let data = body;
            let responseData = JSON.parse(data);

            try {
                if (responseData.deliverable == true)
                    resolve(true);
                else
                    resolve(false);

            } catch (error) {
                reject(error);
            }
        });
    });
};
