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
 * @description : This function returns targeted atomic asset offer.
 * @property : PRIMECHAINTECH
 * */

var bcSdk = require('multichainsdk');
var async = require('async');

exports.get_targeted_offer = (to_address) => {
    return new Promise(async function (resolve, reject) {
        var offer_detail = [];
        let get_offer = await bcSdk.listStreamKeyItemsStream({
            key: to_address,
            stream: "OFFER_DETAIL_STREAM"
        }).then((get_offer) => {

            async.forEach(get_offer.response, (element, cb) => {
                let offer_info = JSON.parse(element.data);
                bcSdk.listStreamKeyItemsStream({
                    key: offer_info.txid,
                    stream: "OFFER_STATUS_STREAM"
                }).then((res) => {
                    async.forEach(res.response, (response_status, cb2) => {
                        let offer_status = JSON.parse(response_status.data);
                        if (offer_status.status == "open") {
                            offer_detail.push({
                                "from_address": offer_info.from_address,
                                "to_address": offer_info.to_address,
                                "ask_asset": offer_info.ask_asset,
                                "offer_asset": offer_info.offerAsset,
                                "bid_amount": offer_info.bid_amount,
                                "offer_amount": offer_info.offer_amount,
                                "txid": offer_info.txid,
                                "vout": offer_info.vout,
                                "offer_blob": offer_info.offer_blob,
                                "status": offer_status.status
                            })
                        }
                        cb2();

                    }, (err) => {

                        if (err) {
                            return reject({
                                status: 401,
                                message: err.message
                            });
                        }
                        cb();
                    })
                }).catch((err) => {
                    return reject({
                        status: 401,
                        message: err.message
                    });
                })

            }, (err) => {
                if (err) {
                    return reject({
                        status: 401,
                        message: err.message
                    });
                }
                return resolve({
                    status: 200,
                    response: offer_detail
                })
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};