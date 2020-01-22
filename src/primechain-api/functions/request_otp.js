/** 
Copyright 2018 Primechain Technologies Private Limited.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

/**
 * @author : DJ
 * @description : This function generate a apikey 
 * @property : PRIMECHAINTECH
 * */

//  node modules
var randomString = require('random-string');

// blockchain node module
var bcSdk = require('multichainsdk');

// mysql
var pool = require('../models/api_management');

// error code
var err_code = require('../error-code/error');
var async = require('async');

exports.request_otp = (primechain_address) => {
    return new Promise(async function (resolve, reject) {
        let verify_email = await bcSdk.listStreamKeyItems({
            "key": primechain_address,
            "stream": "DIGITAL_ID_MASTERLIST"
        }).then((verify_email) => {
            if (verify_email.response != null) {
                async.forEach(verify_email.response, (item, callback_1) => {
                    var get_key = item.key;
                    for (let i = 0; i < get_key.length; i++) {
                        if (get_key[i] == primechain_address) {
                            var key = randomString({
                                length: 8,
                                numeric: true,
                                letters: false,
                                special: false,
                                exclude: ['.', '<', '>', '?', '`', '^', '"', '%', '#', '|', ';', '=', '{', '~', '[', '+', '=', '(', ')', '[', ']', '|', '}', '_', '/', ',', ':']
                            });
                            pool.query('INSERT INTO otp(otp,primechain_address) values (?,?)', [key, primechain_address], (error, results) => {
                                if (error) {
                                    return reject({
                                        status: 401,
                                        message: error.message
                                    })
                                } else {
                                    return resolve({
                                        status: 200,
                                        response: key,
                                        message: { "14040": err_code.success_code[14140] }
                                    })
                                }
                            })
                        }
                    }
                    callback_1();

                }, (err) => {
                    if (err) {
                        return resolve({
                            status: 401,
                            response: err.message
                        })
                    }
                })
            } else {
                return resolve({
                    status: 401,
                    response: "This address is not available in Blockchain"
                });
            }
        })
    })
};