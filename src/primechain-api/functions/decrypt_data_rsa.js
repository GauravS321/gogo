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

// nodemodule
var bcSdk = require('multichainsdk');
const NodeRSA = require('node-rsa');
const keys = new NodeRSA();

exports.decrypt_data_rsa = (encrypted_data_rsa, rsa_private_key) => {
    return new Promise(async function (resolve, reject) {
        const key = new NodeRSA(rsa_private_key);
        const decrypted = key.decrypt(encrypted_data_rsa, 'utf8');
        return resolve({
            status: 200,
            response: decrypted
        })
    })
};