// encrypt_data_aes

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
 * @description : This function decrypts a data for provided credentials.
 * @property : PRIMECHAINTECH
 * */

//  node modules
var bcSdk = require('multichainsdk');
var randomString = require('random-string');

exports.decrypt_data_aes = (encrypted_data_aes, aes_password, aes_iv, aes_tag) => {
    return new Promise(async function (resolve, reject) {
        let decrypted = await bcSdk.decrypt({
            content: encrypted_data_aes,
            tag: Buffer.from(aes_tag),
            key: aes_password,
            iv: aes_iv
        }).then((decrypted) => {
            return resolve({
                status: 200,
                response: JSON.parse(decrypted.response),
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    });
}
