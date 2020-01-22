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
 * @description : This function generate atomic transaction.
 * @property : PRIMECHAINTECH
 * */

var bcSdk = require('multichainsdk');

exports.create_bid = (from_address, to_address, invoice_reference_number, token, token_amount) => {
    return new Promise(async function (resolve, reject) {

        let subscribe_asset = await bcSdk.subscribe({
            stream: invoice_reference_number
        })

        let subscribe_offerAsset = await bcSdk.subscribe({
            stream: token
        })

        let import_address = await bcSdk.importAddress({
            address: to_address
        })

        let lockunspent_assets = await bcSdk.prepareLockUnspentFrom({
            from: from_address,
            assets: { [token]: token_amount }

        }).then((lockunspent_assets) => {

            let unspent_asset = lockunspent_assets.response;
            bcSdk.createRawExchange({
                txid: unspent_asset.txid,
                vout: unspent_asset.vout,
                assets: { [invoice_reference_number]: 1 } //invoice_reference_number
            }).then((res) => {

                var raw_exchange = res.response;
                var data = {
                    from_address: from_address,
                    to_address: to_address,
                    invoice_reference_number: invoice_reference_number,
                    token: token,
                    token_amount: token_amount,
                    txid: unspent_asset.txid,
                    vout: unspent_asset.vout,
                    offer_blob: raw_exchange
                }

                bcSdk.publish({
                    key: [to_address, invoice_reference_number],
                    value: JSON.stringify(data),
                    stream: "OFFER_DETAIL_STREAM"
                }).then((res) => {
                    return resolve({
                        status: 200,
                        response: res.response,
                        offer_txid: data.txid,
                    })
                }).catch(err => {

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
    })
};