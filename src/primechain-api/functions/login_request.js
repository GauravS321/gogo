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
 * @description : This function is for Blockchain based authentication.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');
const NodeRSA = require('node-rsa');
var randomString = require('random-string');

exports.login_request = (primechain_address) => {
    return new Promise(async function (resolve, reject) {
        let get_result = await bcSdk.listStreamKeyItemsStream({
            key: primechain_address,
            stream: "ONBOARD_USERLIST"
        }).then((get_result) => {
            let pub_key = JSON.parse(get_result.response[0].data)
            var session_key = randomString({
                length: 40,
                numeric: true,
                letters: true
            })
            const key = new NodeRSA(pub_key.rsa_public_key);
            const encrypted = key.encrypt("PT-" + session_key, 'base64');
            return resolve({
                status: 200,
                response: encrypted
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};