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
 * @description : This function encrypts a data using aes algorithm and signs with blockchain address then stores to blockchain.
 * @property : PRIMECHAINTECH
 * */

//  node modules
var bcSdk = require('multichainsdk');
var crypto = require('crypto');
var randomString = require('random-string');

exports.encrypt_sign_store_data = (primechain_address, data, stream_name) => {
    return new Promise(async function (resolve, reject) {

        let hash = crypto.createHash('sha512').update(JSON.stringify(data)).digest('base64');

        let sign_message = await bcSdk.signMessage({
            address: primechain_address,
            message: hash
        }).then((sign_message) => {
            let signature_data = {
                address: primechain_address,
                file_hash: hash,
                signature: sign_message.response
            };

            let signature = sign_message.response;

            bcSdk.publishFrom({
                from: primechain_address,
                key: hash,
                value: JSON.stringify(signature_data),
                stream: "GREAT"
            }).then((res) => {
                let signature_response = res.response
                let key = randomString({
                    length: 32,
                    numeric: true,
                    letters: true,
                    special: false,
                });

                let iv = randomString({
                    length: 12,
                    numeric: true,
                    letters: true,
                    special: false,
                });

                let file_data_str = JSON.stringify(data);

                bcSdk.encrypt({
                    text: file_data_str,
                    key: key,
                    iv: iv,
                }).then((res) => {
                    let json_list = {
                        content: res.response.content,
                        tag: res.response.tag
                    }
                    bcSdk.publishFrom({
                        from: primechain_address,
                        key: hash,
                        value: JSON.stringify(json_list),
                        stream: stream_name
                    }).then((res) => {
                        return resolve({
                            status: 200,
                            response: res.response,
                            response_sign: signature_response,
                            signature: signature,
                            password: key,
                            iv: iv,
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
                .catch(err => {
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
    });
}
