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
 * @description : This function publish data to Blockchain stream.
 * @property : PRIMECHAINTECH
 * */

//  node modules
const bcSdk = require('multichainsdk');
const crypto = require('crypto');
const randomString = require('random-string');

exports.publish_data = (primechain_address, data, keys, trade_channel_name) => {
    return new Promise((resolve, reject) => {
        let hash = crypto.createHash('sha512').update(JSON.stringify(data)).digest('base64');

        bcSdk.signMessage({
            address: primechain_address,
            message: hash
        })
            .then(res => {
                let signature_data = {
                    address: primechain_address,
                    file_hash: hash,
                    signature: res.response
                };

                let signature = res.response;

                bcSdk.publish({
                    key: hash,
                    value: JSON.stringify(signature_data),
                    stream: trade_channel_name
                })
                    .then(res => {
                        let signature_response = res.response;

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
                        })
                            .then(res => {
                                let json_list = {
                                    content: res.response.content,
                                    tag: res.response.tag
                                }
                                bcSdk.publishFrom({
                                    from: primechain_address,
                                    key: keys,
                                    value: JSON.stringify(json_list),
                                    stream: trade_channel_name
                                })
                                    .then((res) => {
                                        return resolve({
                                            status: 200,
                                            response: {
                                                tx_id_enc_data: res.response,
                                                tx_id_signature: signature_response,
                                                signature: signature,
                                                aes_password: key,
                                                aes_iv: iv,
                                                trade_channel_name: trade_channel_name
                                            }
                                        });
                                    })
                                    .catch(err => {
                                        return reject({
                                            status: 401,
                                            message: err.message
                                        });
                                    });
                            })
                            .catch(err => {
                                return reject({
                                    status: 401,
                                    message: err.message
                                });
                            });
                    })
                    .catch(err => {
                        return reject({
                            status: 401,
                            message: err.message
                        });
                    });
            })
            .catch((err) => {
                return reject({
                    status: 401,
                    message: err.message
                });
            });
    });
}
