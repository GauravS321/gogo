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
 * @description : This function grant permission for provided address
 * @property : PRIMECHAINTECH
 * */

const bcSdk = require('multichainsdk');
const error = require('../error-code/error');
// mysql
var pool = require('../models/api_management');

exports.retrieve_details = (primechain_address, otp) => {
    return new Promise(async function (resolve, reject) {
        pool.query('SELECT * FROM otp WHERE otp = ?;', [otp], (error, results) => {
            if (results.length == 1) {
                if (res[0].primechain_address == primechain_address) {
                    bcSdk.listStreamKeyItemData({
                        "key": primechain_address,
                        "stream": "DIGITAL_ID_MASTERLIST"
                    }).then((res) => {
                        api.deleteOne({ otp: otp })
                            .exec()
                            .then(() => {

                            })
                        return resolve({
                            status: 200,
                            response: res.response
                        })
                    }).catch(err => {
                        return reject({
                            status: 401,
                            message: err.message
                        });
                    })
                } else {
                    return reject({
                        status: 401,
                        message: "given primechain address is not matched with OTP"
                    });
                }
            } else {
                return reject({
                    status: 401,
                    message: "given OTP is not valid"
                });
            }
        })
    })
};