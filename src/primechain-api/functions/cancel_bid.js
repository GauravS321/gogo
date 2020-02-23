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
 * @description :  This function cancel atomic transaction.
 * @property : PRIMECHAINTECH
 * */


const bcSdk = require('multichainsdk');
const async = require('async');

exports.cancel_bid = (tx_id) => {
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
                    let tx_out_id = res.response.txid;
                    let tx_vout = res.response.vout;
                    bcSdk.validateAddress({
                        address: res.response.publishers[0]
                    }).then((res) => {
                        if (res.response.ismine == true) {
                            bcSdk.getTxOutData({
                                txid: tx_out_id,
                                vout: tx_vout
                            }).then((res) => {
                                let data_raw_json = JSON.parse(Buffer.from(res.response, 'hex').toString('utf-8'));
                                bcSdk.lockUnspent({
                                    transactionId: data_raw_json.txid,
                                    vout: data_raw_json.vout
                                }).then((res) => {
                                    let reject_response = res.response;
                                    bcSdk.publish({
                                        key: tx_id,
                                        value: JSON.stringify({ status: "cancel" }),
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
                            }).catch(err => {
                                return reject({
                                    status: 401,
                                    message: err.message
                                });
                            })
                        } else {
                            return reject({
                                status: 401,
                                message: "node doesn't contains private key, cannot cancle bid.."
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
                    message: 'Bid is already' + ' ' + status.status
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