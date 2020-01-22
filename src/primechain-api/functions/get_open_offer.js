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
 * @description : This function returns open atomic assets offers.
 * @property : PRIMECHAINTECH
 * */

var bcSdk = require('multichainsdk');

exports.get_open_offer = (primechain_address) => {
    return new Promise(async function (resolve, reject) {
        var offer_detail = [];
        let get_offer = await bcSdk.listStreamKeyItemsStream({
            key: primechain_address,
            stream: "OFFER_DETAIL_STREAM"
        }).then((get_offer) => {

            get_offer.response.forEach(element => {
                var offer_info = JSON.parse(element.data);

                offer_detail.push({
                    "primechain_address": offer_info.primechain_address,
                    "ask_asset": offer_info.ask_asset,
                    "offer_asset": offer_info.offerAsset,
                    "bid_amount": offer_info.bid_amount,
                    "offer_amount": offer_info.offer_amount,
                    "txid": offer_info.txid,
                    "vout": offer_info.vout,
                    "offer_blob": offer_info.offer_blob
                })
            });
            return resolve({
                status: 200,
                response: offer_detail
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};