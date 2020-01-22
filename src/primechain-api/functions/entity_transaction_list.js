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
 * @description : This function returns blockchain transactions for provided address.
 * @property : PRIMECHAINTECH
 * */

// nodemodule
var bcSdk = require('multichainsdk');

exports.entity_transaction_list = (primechain_address) => {
    return new Promise(async function (resolve, reject) {
        let blockchainparams = await bcSdk.listAddressTransactions({
            address: primechain_address
        }).then((blockchainparams) => {
            let arary_obj = blockchainparams.response;
            arary_obj.shift();

            return resolve({
                status: 200,
                response: arary_obj
            })
        }).catch(err => {
            return reject({
                status: 401,
                message: err.message
            });
        })
    })
};