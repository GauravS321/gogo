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
 * @description : This function returns asset details for provide asset name.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');
var async = require('async');
exports.get_asset_info = (primechain_address) => {
    return new Promise(async function (resolve, reject) {
        let blockchainparams = await bcSdk.listAssets({
        }).then((blockchainparams) => {
            var get_issuers_details = [];
            var issuers_address = blockchainparams.response;
            async.forEach(issuers_address, (item, callback) => {
                if (item.issues[0].issuers[0] === primechain_address) {
                    get_issuers_details.push({ "asset_detail": item })
                    callback();
                }
                else {
                    callback();
                }
            }, (err) => {
                if (err) {
                    return reject({
                        status: 401,
                        message: 'cant fetch !'
                    });
                } else if (get_issuers_details.length == 0) {
                    return resolve({
                        status: 401,
                        query: "given address doesnt have any assets"
                    })
                } else {
                    return resolve({
                        status: 200,
                        query: get_issuers_details
                    })
                }
            });
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};