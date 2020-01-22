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
 * @description : This function returns the new public address
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');
const NodeRSA = require('node-rsa');
const keys = new NodeRSA();

exports.create_entity = (external_key_management, generate_rsa_keys) => {
    return new Promise(async function (resolve, reject) {
        if (external_key_management == false) {
            bcSdk.getNewAddress()
                .then((res) => {
                    let get_address = res.response[0].address;

                    if (generate_rsa_keys == true) {
                        keys.generateKeyPair();
                        const priv = keys.exportKey('pkcs8-private');
                        const pub = keys.exportKey('pkcs8-public');
                        return resolve({
                            status: 200,
                            response: {
                                "primechain_address": get_address,
                                "primechain_private_key": null,
                                "primechain_public_key": null,
                                "rsa_private_key": priv,
                                "rsa_public_key": pub
                            }
                        })
                    } else {

                        return resolve({
                            status: 200,
                            response: {
                                "primechain_address": get_address,
                                "primechain_private_key": null,
                                "primechain_public_key": null,
                                "rsa_private_key": null,
                                "rsa_public_key": null
                            }
                        })
                    }
                }).catch((err) => {
                    return reject({
                        status: 401,
                        message: err.message
                    });
                })
        } else {
            bcSdk.getNewAddress()
                .then((res) => {
                    let new_address = res.response[0].address
                    bcSdk.validateAddress({
                        address: new_address
                    }).then((response) => {
                        let pub_key = response.response.pubkey;
                        bcSdk.dumpPrivKey({
                            address: new_address
                        }).then((result) => {
                            let priv_key = result.response;
                            if (generate_rsa_keys == true) {
                                keys.generateKeyPair();
                                const priv = keys.exportKey('pkcs8-private');
                                const pub = keys.exportKey('pkcs8-public');
                                return resolve({
                                    status: 200,
                                    response: {
                                        "primechain_address": new_address,
                                        "primechain_private_key": priv_key,
                                        "primechain_public_key": pub_key,
                                        "rsa_private_key": priv,
                                        "rsa_public_key": pub
                                    }

                                })
                            }
                            else {

                                return resolve({
                                    status: 200,
                                    response: {
                                        "primechain_address": new_address,
                                        "primechain_private_key": priv_key,
                                        "primechain_public_key": pub_key,
                                        "rsa_private_key": null,
                                        "rsa_public_key": null
                                    }
                                })
                            }
                        }).catch((err) => {
                            return reject({
                                status: 401,
                                message: err.message
                            });
                        })
                    }).catch((err) => {
                        return reject({
                            status: 401,
                            message: err.message
                        });
                    })
                }).catch((err) => {
                    return reject({
                        status: 401,
                        message: err.message
                    });
                })
        }
    })
};