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
 * @description : This function will store user details to Database.
 * @property : PRIMECHAINTECH
 * */


// mysql 
var pool = require('../models/api_management');
// error code
var err_code = require('../error-code/error');

exports.register_user = (user_details) => {
    return new Promise(async function (resolve, reject) {


        pool.query('INSERT INTO user_data SET ?', user_details, (error, results) => {
            if (error) {
                return reject({
                    status: 401,
                    message: error.message
                })
            } else {
                return resolve({
                    status: 200,
                    response: {
                        username: username,
                        password: password
                    },
                    message: { "14040": err_code.success_code[14040] }
                })
            }
        })
    })
};