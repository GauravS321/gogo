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
 * @description : This function retreive all assets from blockchain.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');
var async = require('async');
exports.list_all_asset = () => {
    return new Promise(async function (resolve, reject) {
        let records = [];

        let list_streams = await bcSdk.listStreamItems({
            stream: "TOKEN_MASTERLIST"
        }).then((list_streams) => {
            var list_assets = list_streams.response;
            async.forEach(list_assets, (key, cb) => {
                bcSdk.importAddress({
                    address: key.key[0],
                    label: "importing address"
                })
                if (key != null) {
                    let data = JSON.parse(key.data)
                    bcSdk.getAddressBalances({
                        address: key.key[0]
                    }).then((res) => {
                        async.forEach(res.response, (asset, cb2) => {
                            if (asset.assetref === data.assetref) {
                                records.push({
                                    asset_name: data.name,
                                    asset_ref: data.assetref,
                                    issuers: data.issuers,
                                    quantity: data.quantity,
                                    available_qty: asset.qty,
                                    description: data.description["details"]["asset_description"],
                                    asset_unit: data.description["details"]["asset_unit"]
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
                }
            }, (err) => {
                if (err) {
                    return reject({
                        status: 401,
                        message: err.message
                    });
                }
                return resolve({
                    status: 200,
                    response: records
                })
            })
        }).catch((err) => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};
