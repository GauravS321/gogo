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
 * @description : This function issues a token
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');

exports.create_token = (from_address, to_address, asset, quantity, unit, details) => {
    return new Promise(async function (resolve, reject) {

        let blockchainparams = await bcSdk.issueFrom({
            from: from_address,
            to: to_address,
            asset: asset,
            qty: quantity,
            unit: unit,
            details: details
        }).then((blockchainparams) => {
            bcSdk.subscribe({
                stream: asset.name
            }).then((res) => {
                bcSdk.listAssetsbyName({
                    asset: asset.name
                }).then((res) => {
                    var asset_details = res.response;
                    let data = {
                        name: asset_details[0].name,
                        issuetxid: asset_details[0].issuetxid,
                        assetref: asset_details[0].assetref,
                        issuers: asset_details[0].issues[0].issuers[0],
                        description: asset_details[0].details,
                        quantity: quantity,
                        details: details
                    }
                    bcSdk.publishFrom({
                        from: from_address,
                        key: to_address,
                        value: JSON.stringify(data),
                        stream: "TOKEN_MASTERLIST"
                    }).then((res) => {
                        return resolve({
                            status: 200,
                            response: res.response,
                            assetref: data.assetref,
                            details: data.description
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