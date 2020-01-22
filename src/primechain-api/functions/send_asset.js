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
 * @description : This function send asset as per request from blockchain addresss.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');

exports.send_asset = (from_address, to_address, asset_name, quantity, details) => {
    return new Promise(async function (resolve, reject) {

        let send_asset = await bcSdk.sendAssetFrom({
            from: from_address,
            to: to_address,
            asset: asset_name,
            qty: quantity,
            details: details
        }).then((send_asset) => {
            return resolve({
                status: 200,
                response: send_asset.response
            })
        }).catch(err => {
            return reject({
                message: err.message,
                status: 401
            });
        })
    })
};