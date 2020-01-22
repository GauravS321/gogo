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

exports.onboard_user = (user_identifier, user_description) => {
    return new Promise(async function (resolve, reject) {
        let newaddress = await bcSdk.getNewAddress()

            .then((newaddress) => {
                let new_address = newaddress.response[0].address;
                bcSdk.validateAddress({
                    address: new_address
                }).then((response) => {
                    let pub_key = response.response.pubkey;
                    bcSdk.dumpPrivKey({
                        address: new_address
                    })
                    keys.generateKeyPair();
                    const priv = keys.exportKey('pkcs8-private');
                    const pub = keys.exportKey('pkcs8-public');
                    let data = {
                        "user_identifier": user_identifier,
                        "user_description": user_description,
                        "primechain_public_key": newaddress.pubkey,
                        "primechain_address": newaddress.address,
                        "rsa_public_key": pub,
                    }
                    bcSdk.subscribe({
                        stream: "AUTH_USERS_MASTERLIST"
                    }).then((res) => {
                        bcSdk.publish({
                            key: newaddress.address,
                            value: JSON.stringify(data),
                            stream: "AUTH_USERS_MASTERLIST"
                        }).then((res) => {
                            return resolve({
                                status: 200,
                                response: {
                                    primechain_address: newaddress.address,
                                    primechain_private_key: newaddress.privkey,
                                    primechain_public_key: data.primechain_public_key,
                                    tx_id: res.response,
                                    rsa_public_key: data.rsa_public_key,
                                    rsa_private_key: priv
                                }
                            })
                        }).catch(err => {
                            return reject({
                                status: 401,
                                message: err.message
                            });
                        })
                    }).catch(err => {
                        return reject({
                            status: 401,
                            message: err.message
                        });
                    })
                }).catch(err => {
                    return reject({
                        status: 401,
                        message: err.message
                    });
                })
            }).catch(err => {
                return reject({
                    status: 401,
                    message: err.message
                });
            })
    })
};