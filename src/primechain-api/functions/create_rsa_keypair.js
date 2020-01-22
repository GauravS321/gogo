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
 * @description : This function returns the new RSA keypair.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
const NodeRSA = require('node-rsa');
const keys = new NodeRSA();

exports.create_rsa_keypair = () => {
    return new Promise(async function (resolve, reject) {

        keys.generateKeyPair();
        const priv = keys.exportKey('pkcs8-private');
        const pub = keys.exportKey('pkcs8-public');

        return resolve({
            status: 200,
            response: {
                rsa_public_key: pub,
                rsa_priv_key: priv
            }
        })
    })
};