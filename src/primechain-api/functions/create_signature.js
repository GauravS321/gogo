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
* @description : This function signs a data and generates a signature out of it.
* @property : PRIMECHAINTECH
* */

// nodemodule
var bcSdk = require('multichainsdk');
var async = require('async');

exports.create_signature = (primechain_address, hash, save_to_great) => {
    return new Promise(function (resolve, reject) {
        var signers_list = [];
        if (save_to_great == false) {
            bcSdk.signMessage({
                address: primechain_address,
                message: hash
            }).then((res) => {
                return resolve({
                    status: 200,
                    signature: res.response,
                    response: null
                })
            }).catch(err => {
                return reject({
                    status: 401,
                    message: err.message
                });
            })
        } else {
            bcSdk.listStreamKeyItemsStream({
                key: hash,
                stream: "GREAT"
            }).then((res) => {
                if (res.response != null) {
                    async.forEach(res.response, (stream_item, callback) => {
                        if (stream_item) {
                            signers_list.push(stream_item["publishers"]);
                            callback();
                        } else {
                            callback();
                        }
                    }, (err) => {
                        if (err) {
                            return Error("Async call failed");
                        }

                        let address_found = signers_list.find(function (myaddress) {
                            return myaddress == primechain_address;
                        });
                        if (address_found == undefined) {
                            let sign_message = bcSdk.signMessage({
                                address: primechain_address,
                                message: hash
                            }).then((res) => {
                                let data = {
                                    address: primechain_address,
                                    file_hash: hash,
                                    signature: res.response
                                };

                                let store_signature = bcSdk.publishFrom({
                                    from: primechain_address,
                                    key: hash,
                                    value: JSON.stringify(data),
                                    stream: "GREAT"
                                }).then((res) => {
                                    return resolve({
                                        status: 200,
                                        response: res.response,
                                        signature: data.signature
                                    })
                                }).catch(err => {

                                    return reject({
                                        status: 401,
                                        message: err.message
                                    })
                                })
                            }).catch(err => {

                                return reject({
                                    status: 401,
                                    message: err.message
                                })
                            })
                        } else {
                            return reject({
                                status: 401,
                                message: "data already signed"
                            })
                        }
                    })
                } else {
                    bcSdk.signMessage({
                        address: primechain_address,
                        message: hash
                    }).then((res) => {
                        let data = {
                            address: primechain_address,
                            file_hash: hash,
                            signature: res.response
                        };
                        bcSdk.publishFrom({
                            from: primechain_address,
                            key: hash,
                            value: JSON.stringify(data),
                            stream: "GREAT"
                        }).then((res) => {
                            return resolve({
                                status: 200,
                                response: res.response,
                                signature: data.signature
                            })
                        }).catch(err => {
                            return reject({
                                status: 401,
                                message: err.message
                            })
                        })
                    }).catch(err => {
                        return reject({
                            status: 401,
                            message: err.message
                        })
                    })
                }
            }).catch(err => {

                return reject({
                    status: 401,
                    message: err.message
                })
            })
        }
    })
};