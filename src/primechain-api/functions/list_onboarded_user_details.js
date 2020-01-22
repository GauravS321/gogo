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
 * @description : This function returns user details present on blockchain stream.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');

exports.list_onboarded_user_details = (primechain_address) => {
    return new Promise(async function (resolve, reject) {
        let get_details = await bcSdk.listStreamKeyItemsStream({
            key: primechain_address,
            stream: "AUTH_USERS_MASTERLIST"
        })
            .then((get_details) => {
                let parse_output = JSON.parse(get_details.response[0].data)
                return resolve({
                    status: 200,
                    response: {
                        "rsa_public_key": parse_output.rsa_public_key,
                        "user_identifier": parse_output.user_identifier,
                        "user_description": parse_output.user_description,
                        "primechain_public_key": parse_output.primechain_public_key
                    }
                })
            }).catch((err) => {
                return reject({
                    status: 401,
                    message: err.message

                })
            })
    })
};