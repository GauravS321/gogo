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
 * @description : This function generates Blockchain address as well RSA keypair.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');
const NodeRSA = require('node-rsa');
const keys = new NodeRSA();

exports.create_entity_rsa = () => {
    return new Promise(async function (resolve, reject) {
        let newaddress = await bcSdk.createKeyPairs({
            count: 1,
            verbose: true
        }).then((newaddress) => {
            keys.generateKeyPair();
            const priv = keys.exportKey('pkcs8-private');
            const pub = keys.exportKey('pkcs8-public');

            return resolve({
                status: 200,
                address: newaddress.address,
                pub_key: newaddress.pubkey,
                priv_key: newaddress.privkey,
                private_key: priv,
                public_key: pub
            })

        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};