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
 * @description : This function accepts offer from provided address
 * @property : PRIMECHAINTECH
 * */

var bcSdk = require('multichainsdk');


exports.accept_offer = (offer_blob, primechain_address) => {
    return new Promise(async function (resolve, reject) {

        let decoder_exchange = await bcSdk.decodeRawExchange({
            hexstring: offer_blob
        }).then((decoder_exchange) => {
            // decode offer logic
            let convert_to_string = JSON.stringify(decoder_exchange.response);
            let json_parse = JSON.parse(convert_to_string)
            let offer_asset_name = json_parse.offer.assets[0].name;
            let offer_asset_qty = json_parse.offer.assets[0].qty;
            let ask_asset_name = json_parse.ask.assets[0].name;
            let ask_asset_qty = json_parse.ask.assets[0].qty;
            // creating an object to pass
            let offer_asset = {};
            offer_asset[offer_asset_name] = offer_asset_qty;
            let ask_asset = {};
            ask_asset[ask_asset_name] = ask_asset_qty;

            bcSdk.prepareLockUnspentFrom({
                from: primechain_address,
                assets: ask_asset
            }).then((res) => {
                bcSdk.appendRawExchange({
                    hexstring: offer_blob,
                    txid: res.response.txid,
                    vout: res.response.vout,
                    assets: offer_asset
                }).then((res) => {
                    let append_raw = res.response;

                    bcSdk.sendRawTransaction({
                        hexstring: append_raw.hex
                    }).then((res) => {
                        return resolve({
                            status: 200,
                            response: res.response
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