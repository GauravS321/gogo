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
 * @description : This function creates public atomic assets offer
 * @property : PRIMECHAINTECH
 * */

var bcSdk = require('multichainsdk');

exports.create_public_offer = (primechain_address, ask_asset, offer_asset) => {
    return new Promise(async function (resolve, reject) {

        var asset_key = Object.keys(ask_asset)
        var asset_ref = asset_key[0]

        var off_ref = Object.keys(offer_asset)
        var offer_Asset = off_ref[0]

        var asset_amount = Object.values(ask_asset)
        var bid_amount = asset_amount[0]

        var offer_asset_amount = Object.values(offer_asset)
        var offer_amount = offer_asset_amount[0]

        let subscribe_asset = await bcSdk.subscribe({
            stream: asset_ref
        })

        let subscribe_offerAsset = await bcSdk.subscribe({
            stream: offer_Asset
        })

        let import_address = await bcSdk.importAddress({
            address: primechain_address
        })

        let lockunspent_assets = await bcSdk.prepareLockUnspentFrom({
            from: primechain_address,
            assets: offer_asset
        }).then((lockunspent_assets) => {

            let unspent_asset = lockunspent_assets.response;
            bcSdk.createRawExchange({
                txid: unspent_asset.txid,
                vout: unspent_asset.vout,
                assets: ask_asset
            }).then((res) => {

                var raw_exchange = res.response;
                var data = {
                    primechain_address: primechain_address,
                    ask_asset: asset_ref,
                    offerAsset: offer_Asset,
                    bid_amount: bid_amount,
                    offer_amount: offer_amount,
                    txid: unspent_asset.txid,
                    vout: unspent_asset.vout,
                    offer_blob: raw_exchange
                }

                bcSdk.publish({
                    key: primechain_address,
                    value: JSON.stringify(data),
                    stream: "OFFER_DETAIL_STREAM"
                }).then((res) => {
                    return resolve({
                        status: 200,
                        response: res.response,
                        // offer_blob: raw_exchange,
                        offer_txid: data.txid,
                        offer_vout: data.vout
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