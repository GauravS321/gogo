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
 * @description : This function rejects atomic raw transaction of provided tx_id.
 * @property : PRIMECHAINTECH
 * */


const bcSdk = require('multichainsdk');
const async = require('async');

exports.reject_bid = (tx_id, address) => {
    return new Promise(async function (resolve, reject) {
        let get_status = await bcSdk.listStreamKeyItemsStream({
            key: tx_id,
            stream: 'OFFER_STATUS_STREAM'
        }).then(result => {
            if (result.response == null) {
                bcSdk.getStreamItem({
                    stream: "OFFER_DETAIL_STREAM",
                    txid: tx_id,
                }).then((res) => {
                    bcSdk.getTxOutData({
                        txid: res.response.txid,
                        vout: res.response.vout
                    }).then((res) => {
                        let data_raw_json = JSON.parse(Buffer.from(res.response, 'hex').toString('utf-8'));
                        if (address == data_raw_json.to_address) {
                            bcSdk.validateAddress({
                                address: address
                            }).then((res) => {
                                if (res.response.ismine == true) {
                                    bcSdk.lockUnspent({
                                        transactionId: data_raw_json.txid,
                                        vout: 0
                                    }).then((res) => {
                                        let reject_response = res.response;
                                        bcSdk.publish({
                                            key: tx_id,
                                            value: JSON.stringify({ status: "REJECTED" }),
                                            stream: "OFFER_STATUS_STREAM"
                                        }).then((res) => {
                                            return resolve({
                                                status: 200,
                                                response: reject_response
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
                                } else {
                                    return reject({
                                        status: 401,
                                        message: "node doesn't contains private key,not allowed to reject bid"
                                    });
                                }
                            })

                        } else {
                            return reject({
                                status: 401,
                                message: "provided entity is not allowed to reject bid"
                            });
                        }
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
            } else {
                let status = JSON.parse(result.response[0].data);

                return reject({
                    status: 401,
                    message: 'Bid is already' + ' ' + status.status + ' by targetted entity'
                });
            }
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};